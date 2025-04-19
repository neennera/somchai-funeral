"use client"
import { useState } from "react";
import TestThreeScene from "@/components/TestThreeScene";
import Popup from "@/components/Popup";
import CreditPopup from "@/components/CreditPopup";

export default function Home() {
  const [popupId, setPopupId] = useState(-1);
  const [showCredit, setShowCredit] = useState(false);

  return (
    <div
      className="h-full w-full text-white overflow-hidden "
    >
      <div className="absolute -z-30 bg-gradient-to-b from-black via-gray-800 to-black w-screen h-screen"></div>
      {/* Static Top Left */}
      <div className="absolute top-4 left-4 font-bold text-lg">
        งานศพของสมชาย
      </div>

      {/* Static Top Right */}
      <div className="absolute top-4 right-4 space-x-2">
        <a
          href="https://github.com/neennera/somchai-funeral"
          target="_blank"
          className="text-gray-400 hover:text-gray-200"
        >
          โค้ดของโปรเจค
        </a>
        <button
          className="text-gray-400 hover:text-gray-200 cursor-pointer"
          onClick={() => setShowCredit(true)} // Show the credit popup
        >
          เครดิต
        </button>
      </div>

      {/* Screen */}
      <div className="w-full h-full overflow-hidden">
        <TestThreeScene setPopupId={setPopupId} />
      </div>

      {/* Popup */}
      {popupId !== -1 && <Popup popupId={popupId} setPopupId={setPopupId} />}
      {showCredit && <CreditPopup onClose={() => setShowCredit(false)} />} {/* Show CreditPopup */}


      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center italic">
        <p>โลงศพเป็นมากกว่าเครื่องบรรจุร่าง มันคือสิ่งที่สะท้อนตัวตนของผู้ที่อยู่ข้างใน</p>
        <p>
          นี่คือโปรเจค Web 3D ที่จำลองบรรยากาศงานศพ เพื่อให้เราได้ระลึกถึงและเข้าใจชีวิตของสมชายในแบบที่เขาเป็น
        </p>
      </footer>
    </div>
  );
}