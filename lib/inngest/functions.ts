import { inngest } from "@/lib/inngest/client";
import {
  NEWS_SUMMARY_EMAIL_PROMPT,
  PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from "@/lib/inngest/prompts";
import {
  sendNewsSummaryEmail,
  sendWelcomeEmail,
} from "@/lib/nodemailer";
import { getAllUsersForNewsEmail } from "@/lib/actions/user.actions";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { getNews } from "@/lib/actions/finnhub.actions";
import { getFormattedTodayDate } from "@/lib/utils";

/* ============================================================
   1️⃣  SEND SIGN-UP EMAIL
============================================================ */

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email" },
  { event: "app/user.created" },
  async ({ event, step }) => {
    try {
      const userProfile = `
        - Country: ${event.data?.country}
        - Investment goals: ${event.data?.investmentGoals}
        - Risk tolerance: ${event.data?.riskTolerance}
        - Preferred industry: ${event.data?.preferredIndustry}
      `;

      const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
        "{{userProfile}}",
        userProfile
      );

      const response = await step.ai.infer("generate-welcome-intro", {
        model: step.ai.models.gemini({
          model: "gemini-2.5-flash-lite",
        }),
        body: {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        },
      });

      const introText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "Thanks for joining TradeFlow. You now have the tools to track markets and make smarter moves.";

      await step.run("send-welcome-email", async () => {
        return await sendWelcomeEmail({
          email: event.data?.email,
          name: event.data?.name,
          intro: introText,
        });
      });

      return { success: true };
    } catch (error) {
      console.error("Sign-up email failed:", error);
      return { success: false };
    }
  }
);

/* ============================================================
   2️⃣  SEND DAILY NEWS SUMMARY
============================================================ */

export const sendDailyNewsSummary = inngest.createFunction(
  { id: "daily-news-summary" },
  [
    { event: "app/send.daily.news" },
    { cron: "30 6 * * *" }, // ✅ 12 PM IST
  ],
  async ({ step }) => {
    try {
      /* ---------------------------
         STEP 1: Get Users
      --------------------------- */
      const users = await step.run(
        "get-all-users",
        getAllUsersForNewsEmail
      );

      if (!users?.length) {
        return { success: false, message: "No users found" };
      }

      /* ---------------------------
         STEP 2: Fetch News (Parallel)
      --------------------------- */
      const userNews = await step.run("fetch-user-news", async () => {
        return await Promise.all(
          users.map(async (user: UserForNewsEmail) => {
            try {
              const symbols = await getWatchlistSymbolsByEmail(user.email);

              let articles = await getNews(symbols);
              articles = (articles || []).slice(0, 6);

              if (!articles.length) {
                articles = (await getNews()).slice(0, 6);
              }

              return { user, articles };
            } catch (error) {
              console.error("Error fetching news for:", user.email);
              return { user, articles: [] };
            }
          })
        );
      });

      /* ---------------------------
         STEP 3: AI Summarization (Parallel)
      --------------------------- */
      const summaries = await Promise.all(
        userNews.map(async ({ user, articles }) => {
          try {
            if (!articles.length) {
              return { user, newsContent: null };
            }

            const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
              "{{newsData}}",
              JSON.stringify(articles, null, 2)
            );

            const response = await step.ai.infer(
              `summarize-news-${user.email}`,
              {
                model: step.ai.models.gemini({
                  model: "gemini-2.5-flash-lite",
                }),
                body: {
                  contents: [
                    {
                      role: "user",
                      parts: [{ text: prompt }],
                    },
                  ],
                },
              }
            );

            const newsContent =
              response?.candidates?.[0]?.content?.parts?.[0]?.text ??
              "No major market updates today.";

            return { user, newsContent };
          } catch (error) {
            console.error(
              "AI summarization failed for:",
              user.email
            );
            return { user, newsContent: null };
          }
        })
      );

      /* ---------------------------
         STEP 4: Send Emails (Parallel)
      --------------------------- */
      await step.run("send-news-emails", async () => {
        await Promise.all(
          summaries.map(async ({ user, newsContent }) => {
            if (!newsContent) return;

            return await sendNewsSummaryEmail({
              email: user.email,
              date: getFormattedTodayDate(),
              newsContent,
            });
          })
        );
      });

      return {
        success: true,
        message: "Daily news summary emails sent successfully",
      };
    } catch (error) {
      console.error("Daily news summary failed:", error);
      return { success: false };
    }
  }
);
