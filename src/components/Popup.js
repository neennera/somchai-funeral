import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function Popup({ popupId, setPopupId }) {
  const [itemsInfo, setItemsInfo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data/itemsinfo.csv");
      const csvText = await response.text();
      const parsedData = Papa.parse(csvText, { header: true });
      setItemsInfo(parsedData.data);
    };

    fetchData();
  }, []);

  if (popupId === -1 || itemsInfo.length === 0) return null;

  const item = itemsInfo[popupId - 1];

  if (!item) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm bg-opacity-50">
      <div
        className="relative bg-gray-800 text-white p-6 rounded shadow-lg 
                   w-[90vw] h-[70vh] sm:w-[50vw] sm:h-[40vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold mb-4">{item.name}</h2>
        <p className="whitespace-pre-wrap">
          {item.detail.replace(/\\n/g, "\n")}
        </p>
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-red-600 hover:bg-red-500 hover:cursor-pointer rounded"
          onClick={() => setPopupId(-1)}
        >
          ปิด
        </button>
      </div>
    </div>
  );
}