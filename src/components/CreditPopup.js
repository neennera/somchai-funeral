export default function CreditPopup({ onClose }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm bg-opacity-50">
        <div className="relative bg-gray-800 w-[50vw] h-auto text-white p-6 rounded shadow-lg">
          <h2 className="text-xl font-bold mb-4">เครดิต</h2>
          <p className="mb-2">
            Credit Tutorial:{" "}
            <a
              href="https://youtu.be/QATefHrO4kg?si=URVfHgrz7c-Iauhx"
              target="_blank"
              className="text-blue-400 underline"
            >
              https://youtu.be/QATefHrO4kg?si=URVfHgrz7c-Iauhx
            </a>
          </p>
          <p className="mb-2">
            Object models from:{" "}
            <a
              href="https://www.cgtrader.com/"
              target="_blank"
              className="text-blue-400 underline"
            >
              https://www.cgtrader.com/
            </a>
          </p>
          <ul className="list-disc pl-6">
            <li>coffin - nicmacanimations</li>
            <li>guitar - Yoshikitaima</li>
            <li>noodle - elle-ly</li>
            <li>piggy bank - Sanyi3D</li>
            <li>plant - diego-michelsbueno</li>
          </ul>
          <button
            className="absolute top-4 right-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
            onClick={onClose}
          >
            ปิด
          </button>
        </div>
      </div>
    );
  }