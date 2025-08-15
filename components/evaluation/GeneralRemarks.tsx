"use client";

import React from "react";

interface GeneralRemarksProps {
  value: string;
  onChange: (val: string) => void;
}

const generalRemarksList = [
  "The subject property is a modern single storied residential house...",
  "The subject property enjoys all the major facilities...",
  "The value principally reflects the construction materials...",
  "We have realized through Rwanda land management and use authority...",
  "Other..",
];

export default function GeneralRemarks({ value, onChange }: GeneralRemarksProps) {
  return (
    <section className="max-w-4xl mx-auto p-6 bg-white text-black rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-2 px-4 rounded">
        X. GENERAL REMARKS
      </h2>

      <ul className="mb-4">
        {generalRemarksList.map((remark, idx) => (
          <li
            key={idx}
            className={`cursor-pointer p-2 rounded ${
              value === remark ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"
            }`}
            onClick={() => onChange(remark)}
          >
            {remark}
          </li>
        ))}
      </ul>

      <textarea
        className="w-full border rounded p-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add any other remarks..."
      />
    </section>
  );
}
