"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

import ScheduleCard from "@/components/ScheduleCard";
import DetailsCard from "@/components/DetailsCard";
import PaymentCard from "@/components/PaymentCard";

export default function BookingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [email, setEmail] = useState("Loading ...");
  const [name, setName] = useState("Loading ...");
  const [phone, setPhone] = useState("Loading ...");
  const [place, setPlace] = useState("Loading ...");
  const [vendorEmail, setVendorEmail] = useState("");
  const [bookTime, setBookTime] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  // ✅ Schedule info (hydrated client-side)
  const [time, setTime] = useState<string>("Loading ...");
  const [date, setDate] = useState<string>("Loading ...");
  const [takePlaceAt, setTakePlaceAt] = useState<string>("Loading ...");

  const [loading, setLoading] = useState(false);

  // ✅ Load localStorage values client-side only
  useEffect(() => {
    const storedTime = localStorage.getItem("time");
    const storedDate = localStorage.getItem("date");
    const storedJobAt = localStorage.getItem("job_at");

    setTime(storedTime ?? "N/A");
    setDate(storedDate ?? "N/A");
    setTakePlaceAt(storedJobAt ?? "N/A");
  }, []);

  // ✅ Watch auth state and fetch booking info
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Get subtotal
        const snapshot = await getDocs(
          collection(db, "BHub", currentUser.uid, "Booking")
        );
        let total = 0;
        snapshot.forEach((doc) => {
          total += parseInt(doc.data().price);
        });
        setPrice(total);

        await fetchBooking(currentUser.uid);
      }
    });
    return () => unsub();
  }, []);

  const fetchBooking = async (uid: string) => {
    const userDoc = await getDoc(doc(db, "BHub", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setEmail(data.email ?? "");
      setName(`${data.fName ?? ""} ${data.lName ?? ""}`);
      setPhone(data.phoneNumber ?? "");
      setPlace(data.deliverTo ?? "");
    }
  };

  // ✅ Confirm booking
  const confirmBooking = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const d = new Date();
      const dateM = d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const timeM = d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const salonName = localStorage.getItem("salon_name") || "";
      const vendorID = localStorage.getItem("salon_id") || "";
      
      setBookTime(date + ", " + time);
      const vendorDoc = await getDoc(doc(db, "BHub", vendorID));
      if (vendorDoc.exists()) {
        setVendorEmail(vendorDoc.data().email);
      }

      const order = {
        email,
        orderDate: dateM,
        phone,
        fullName: name,
        order: "pending",
        price: String(price),
        paymentType: "Cash",
        orderTime: `Placed at: ${timeM}`,
        userID: user.uid,
        vendorID,
        vendorTitle: salonName,
        schedule: date,
        deliverTo: place,
        scheduleTime: time,
        takePlaceAt,
      };

      await sendEmail();
      await setDoc(doc(db, "New Orders", user.uid), order);
      window.location.assign("/orderstatus.html");
    } catch (err) {
      console.error("Error confirming booking:", err);
    } finally {
      setLoading(false);
    }
  };

  async function sendEmail() {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: vendorEmail,
        subject: "New booking",
        html: `<strong>From ${name} at ${place} scheduled at ${bookTime} and wants service for UGX ${price.toLocaleString()} says ${takePlaceAt}</strong>`,
      }),
    });
    console.log("Email sent successfully to: " + vendorEmail);

    const data = await res.json();
    setEmailStatus(JSON.stringify(data));

    // await sendPush();
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="fixed top-0 w-full h-16 bg-neutral-900 flex items-center justify-center z-10">
        <h2 className="text-lg font-light">Booking</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-20 pb-28 px-4">
        <h3 className="text-xl mb-4">Schedule</h3>
        <ScheduleCard time={time} date={date} takePlaceAt={takePlaceAt} />

        <h3 className="text-xl mb-2">My Details</h3>
        <DetailsCard email={email} name={name} phone={phone} place={place} />

        <h3 className="text-xl mt-6 mb-2">Payment</h3>
        <PaymentCard />

        <div className="flex justify-between mt-6">
          <span>Sub Total</span>
          <span>Ugx {price.toLocaleString()}</span>
        </div>
      </div>

      {/* Footer Button */}
      <div className="fixed bottom-0 w-full p-4 bg-neutral-900 z-10">
        <button
          onClick={confirmBooking}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold ${
            loading
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </div>
          ) : (
            "CONFIRM BOOKING"
          )}
        </button>
      </div>
    </div>
  );
}