"use client"
import { useState } from "react";
import Popup from "@/components/Popup";

export default function Home() {
  const [popupId, setPopupId] = useState(-1);

  const items = [
    "ภาพหน้าโลง",
    "กีตาร์โปร่งตัวเก่า",
    "หม้อแกงเขียวหวาน",
    "ต้นโพธิ์เล็กในกระถาง",
    "สมุดบันทึกเก่า",
    "กล่องรับบริจาค",
  ];

  return (
    <div
      className="h-full w-full text-white overflow-hidden"
    >
      <div className="absolute -z-30 bg-gradient-to-b from-black via-gray-800 to-black w-screen h-screen"></div>
      {/* Static Top Left */}
      <div className="absolute top-4 left-4 font-bold text-lg">
        งานศพของสมชาย
      </div>

      {/* Static Top Right */}
      <div className="absolute top-4 right-4">
        <a
          href="https://github.com/neennera/somchai-funeral"
          target="_blank"
          className="text-gray-400 hover:text-gray-200"
        >
          โค้ดของโปรเจค
        </a>
      </div>

      {/* Buttons */}
      <div className="w-full h-[75vh] grid grid-cols-3 gap-4 justify-center items-center mt-20">
        {items.map((item, index) => (
          <button
            key={index}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded hover:scale-110 hover:cursor-pointer transition-all"
            onClick={() => setPopupId(popupId === index ? -1 : index)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Popup */}
      {popupId !== -1 && <Popup popupId={popupId} setPopupId={setPopupId} />}

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