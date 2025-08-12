interface ServiceSiteWorksProps {
  siteWorks: any | null;
}

export default function ServiceSiteWorks({ siteWorks }: ServiceSiteWorksProps) {
  if (!siteWorks) return <p>No site works data available.</p>;

  const renderArray = (arr: any) =>
    Array.isArray(arr) && arr.length > 0 ? (
      <ul className="list-disc list-inside space-y-1">
        {arr.map((item: string, idx: number) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    ) : (
      <em>Not specified</em>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-black rounded-lg shadow-lg">
      <h2 className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 font-bold text-xl rounded-md mb-6 text-center">
        VIII. SERVICE & SITE WORKS
      </h2>

      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">a. SERVICES</h3>

        <div className="mb-4">
          <h4 className="font-medium text-violet-700 mb-2">Access</h4>
          {renderArray(siteWorks.access_types)}
        </div>

        <div>
          <h4 className="font-medium text-violet-700 mb-2">Supply</h4>
          {renderArray(siteWorks.supply_types)}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">b. SITE WORK</h3>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Boundary Walls</h4>
          {siteWorks.has_boundary_wall ? "Yes" : "No"}
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Foundation</h4>
          {renderArray(siteWorks.foundation_types)}
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Walls</h4>
          {renderArray(siteWorks.walls)}
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Finishing</h4>
          {renderArray(siteWorks.finishing)}
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Gate</h4>
          {renderArray(siteWorks.gate_types)}
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Yard</h4>
          {renderArray(siteWorks.yard_types)}
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Lighting</h4>
          {renderArray(siteWorks.lighting)}
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Other Features</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Swimming pool (sqm): {siteWorks.swimming_pool_sqm ?? <em>Not specified</em>}</li>
            <li>Playground (sqm): {siteWorks.playground_sqm ?? <em>Not specified</em>}</li>
            <li>CCTV Installed: {siteWorks.cctv_installed || <em>Not specified</em>}</li>
            <li>Solar System Installed: {siteWorks.solar_system_installed || <em>Not specified</em>}</li>
          </ul>
        </div>

        {siteWorks.pictures && (
          <div className="mt-6">
            <h4 className="font-medium text-violet-700 mb-2">Pictures</h4>
            {(() => {
              try {
                const pics = typeof siteWorks.pictures === "string" ? JSON.parse(siteWorks.pictures) : siteWorks.pictures;
                return (
                  <div className="grid grid-cols-2 gap-4">
                    {pics.map((pic: string, idx: number) => (
                      <img
                        key={idx}
                        src={pic}
                        alt={`Site work ${idx + 1}`}
                        className="w-full h-40 object-cover rounded"
                      />
                    ))}
                  </div>
                );
              } catch {
                return <em>Invalid picture data</em>;
              }
            })()}
          </div>
        )}
      </section>
    </div>
  );
}
