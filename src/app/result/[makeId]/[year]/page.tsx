import React from "react";

interface IMake {
  Make_ID: number;
  Make_Name: string;
}

interface IMakeExtended {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}

export const generateStaticParams = async () => {
  const makeResponce = await fetch(
    `https://vpic.nhtsa.dot.gov/api//vehicles/GetAllMakes?format=json`
  );
  const makeData = await makeResponce.json();
  const makeIdArr = makeData?.Results.map((make: IMake) => {
    return make.Make_ID;
  });

  const yearsRange = Array.from(
    { length: new Date().getFullYear() - 2015 + 1 },
    (_, i) => 2015 + i
  );

  const paths = makeIdArr.flatMap((makeId: number) =>
    yearsRange.map((year: number) => ({
      params: {
        makeId: makeId.toString(),
        year: year.toString(),
      },
    }))
  );
  return paths;
};

async function getCars(makeId: string, year: string) {
  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
    );
    const data = await res.json();
    return data.Results;
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

async function getCurrentCar(makeId: string) {
  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/${makeId}?format=json`
    );
    const data = await res.json();
    return data.Results;
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

export default async function ResultPage({
  params,
}: {
  params: { makeId: string; year: string };
}) {
  const cars = await getCars(params.makeId, params.year);
  const currentCar = await getCurrentCar(params.makeId);
  return (
    <div>
      <header className="app-header">
        <h1>
          Car Dealer App / {currentCar[0].Make_Name} of {params.year}
        </h1>
      </header>
      <section className="mt-10 mx-2 px-2">
        {cars.length > 0 ? (
          <ul>
            {cars.map((car: IMakeExtended, index: number) => (
              <li
                className={`mb-5 border p-2 rounded-md ${index % 2 && "bg-gray-200"}`}
                key={index}
              >
                <div>
                  <h4 className="font-mono">{car.Make_Name}</h4>
                  <p>
                    Model: <strong className="font-mono">{car.Model_Name}</strong>
                  </p>
                  <p>
                    Year: <strong className="font-mono">{params.year}</strong>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No cars found</p>
        )}
      </section>
    </div>
  );
}
