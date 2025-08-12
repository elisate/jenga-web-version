import React from 'react';

const generalRemarks = [
  "The subject property is a modern single storied residential house which poses to low class fittings and finishes, is located with an area predominantly of low to low-income residential houses and vacant plot.",
  "The subject property enjoys all the major facilities and is set within close proximity to the public services including schools, church, pub, hotels and other transport means.",
  "The value principally reflects the construction materials employed, premises actual location but also the purchasing power vis-a-vis demand factors within the immediate vicinity of the subject property.",
  "We have realized through Rwanda land management and use authority that the parcel has zero mortgage and zero caveat.",
  "Other..",
];

function GeneralRemarks() {
  return (
    <section className="max-w-4xl mx-auto p-6 bg-white text-black rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-2 px-4 rounded">
        X. GENERAL REMARKS
      </h2>
      {generalRemarks.map((remark, idx) => (
        <p key={idx} className="mb-4 leading-relaxed">
          {remark}
        </p>
      ))}
    </section>
  );
}

export default GeneralRemarks;
