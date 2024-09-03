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
      <h2>
        Models of {currentCar[0].Make_Name} for {params.year}
      </h2>
      <div>
        {cars.length > 0 ? (
          <ul>
            {cars.map((car: IMakeExtended) => (
              <li key={car.Make_ID}>
                <div>
                  <h4>{car.Make_Name}</h4>
                  <h3>
                    {car.Model_Name} {params.year}
                  </h3>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No cars found</p>
        )}
      </div>
    </div>
  );
}
