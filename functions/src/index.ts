import * as admin from "firebase-admin";
import {onSchedule} from "firebase-functions/v2/scheduler";

// Fix: Initialize the Firebase Admin SDK
admin.initializeApp(); // Initialize the Firebase Admin SDK
const db = admin.firestore();

/**
 * A scheduled function that runs every hour to check for capsules that
 * are ready to be unlocked.
 */
export const checkCapsulesForUnlock = onSchedule(
  "every 60 minutes",
  async () => {
    console.log("Checking for capsules to unlock...");

    const now = new Date();
    // Query for all capsules that are sealed, not yet unlocked,
    // and whose unlock date is in the past.
    const query = db
      .collection("capsules")
      .where("isSealed", "==", true)
      .where("isUnlocked", "==", false)
      .where("unlockDate", "<=", now);

    const snapshot = await query.get();

    if (snapshot.empty) {
      console.log("No capsules are ready to be unlocked at this time.");
      return;
    }

    // For each capsule found, we will eventually send a push notification.
    // For now, we will just log it to the console.
    snapshot.forEach((doc) => {
      const capsule = doc.data();
      console.log(
        `Capsule ${doc.id} is ready for unlock for user ${capsule.userId}`
      );
    });

    return;
  }
);
