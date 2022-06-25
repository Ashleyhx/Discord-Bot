import { Client } from "@notionhq/client";
//import corn from "node-corn"

const notion = new Client({
    auth: "secret_BKyXcMTM6Q1tKZsAk8NwS7cA0CUem1TlHWqBRntlSuh",
});

const databaseId = "43794525fe79492f9e4d1dc5eb5e1432";

export async function NotionEventsListener() {
    const timeStamp = new Date().getTime();
    const yesterdayTimeStamp = timeStamp - 24 * 60 * 60 * 1000;
    const yesterdayDate = new Date(yesterdayTimeStamp);
    const EditedItems = await notion.databases.query({
        database_id: databaseId,
        filter: {
          timestamp: "last_edited_time",
          last_edited_time: {
            after: yesterdayDate.toISOString(),
          },
        },
      });
      console.log(EditedItems.results);

      return EditedItems.results;
}

NotionEventsListener();

// export const scheduleEventsChecking = () => {
//     corn.schedule(
//         "0 8 * * 1-7",
//         function () {
//             NotionEventsListener();
//         },
//         {
//             scheduled: true,
//             timezone: "America/New_York",
//         }
//     );
// };