import Link from 'next/link';
import React from 'react';
export const dynamic = 'force-static';
export const dynamicParams = true;

interface IMake {
  Make_ID?: number;
  Make_Name?: string;
}

interface IMakeExtended {
  Make_ID?: number;
  Make_Name?: string;
  Model_ID?: number;
  Model_Name?: string;
}

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
          Car Dealer App /{' '}
          {currentCar.length > 0
            ? `${currentCar[0].Make_Name} of ${params.year}`
            : 'Car not found :('}
        </h1>
      </header>
      <div className="flex place-content-start mt-5 mx-4">
        <Link href={'/'} className="block w-fit">
          <button className="app-button place-content-center">
            {'< '}BACK
          </button>
        </Link>
      </div>
      <section className="mt-5 mx-2 px-2">
        {cars.length > 0 && currentCar.length > 0 ? (
          <ul>
            {cars.map((car: IMakeExtended, index: number) => (
              <li
                className={`mb-5 border p-2 rounded-md ${index % 2 && 'bg-gray-200'}`}
                key={index}
              >
                <div>
                  <h4 className="font-mono">{car.Make_Name}</h4>
                  <p>
                    Model:{' '}
                    <strong className="font-mono">{car.Model_Name}</strong>
                  </p>
                  <p>
                    Year: <strong className="font-mono">{params.year}</strong>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Sorry, no such cars of {params.year} found</p>
        )}
      </section>
    </div>
  );
}

export async function generateStaticParams(): Promise<
  Array<{ makeId: string; year: string }>
> {
  const paths: Array<{ makeId: string; year: string }> = [
    { makeId: '440', year: '2022' },
  ];
  try {
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

    paths.push(
      ...makeIdArr.flatMap((makeId: number) =>
        yearsRange.map((year) => ({
          makeId: makeId.toString(),
          year: year.toString(),
        }))
      )
    );
  } catch (error) {
    console.error('Error fetching data', error);
  }
  return paths;
}
