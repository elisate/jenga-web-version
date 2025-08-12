import React from "react";

interface Purpose {
  id: number;
  text: string;
}

const Instructions: React.FC = () => {
  const purposes: Purpose[] = [
    { id: 1, text: "Bank purposes" },
    { id: 2, text: "Auction purposes" },
    { id: 3, text: "Court purposes" },
    { id: 4, text: "Book keeping purposes" },
    { id: 5, text: "VISA Application purposes" },
    { id: 6, text: "Insurance purposes" },
  ];

  const data = [
    { label: "Verbal instructions given to us by", value: "NIYITEGEKA DAMASCENE" },
    { label: "Written instructions given to us by", value: "YYYYYYY Xxxxxxxxxxxx" },
    { label: "Date", value: "15/08/2025" },
    {
      label: "Purposes",
      value: (
        <ul className="list-disc list-inside">
          {purposes.map((p) => (
            <li key={p.id}>{p.text}</li>
          ))}
        </ul>
      ),
    },
    { label: "Inspected date", value: "15/08/2025 & 16/08/2025 & …" },
    { label: "Inspected by", value: "Tech Name (Automatic)" },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">I. INSTRUCTIONS</h2>
      <table className="w-full border-collapse text-xs">
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border border-gray-300">
              <th className="border border-gray-300 p-2 text-left font-bold bg-[#f5f3ff] w-1/3 align-top">
                {row.label}
              </th>
              <td className="border border-gray-300 p-2 ">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Instructions;
