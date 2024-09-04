"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "./_components/Loading/loading";

interface ISingleCarData {
  MakeId: number;
  MakeName: string;
  VechicleTypeId: number;
  VehicleTypeName: string;
}
export default function Home() {
  const yearsRange = Array.from(
    { length: new Date().getFullYear() - 2015 + 1 },
    (_, i) => 2015 + i
  );
  const [carsData, setCarsData] = useState([] as ISingleCarData[] | []);
  const [selectedCar, setSelectedCar] = useState(440);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);

  const fetchCarsData = async () => {
    const responce = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json`
    );
    const data = await responce.json();
    setCarsData(data?.Results);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCarsData();
  }, []);

  useEffect(() => {
    setSelectedCar(carsData[0]?.MakeId);
  }, [carsData, setCarsData]);

  return (
    <main className="text-gray-800">
      <header className="app-header">
        <h1>Car Dealer App {new Date().getFullYear()}</h1>
      </header>
      {isLoading ? (
        <Loading />
      ) : (
        <section className="flex place-content-center">
          <div className="sm:border w-max sm:p-5 mt-10">
            <div className="app-select-container">
              <div>
                <label className="app-label" htmlFor="car-select">
                  Car:
                </label>
                <select
                  className="app-select"
                  name="car-select"
                  value={selectedCar}
                  onChange={(e) => setSelectedCar(+e.target.value)}
                >
                  {carsData?.map((item) => (
                    <option value={item?.MakeId} key={item?.MakeId}>
                      {item?.MakeName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="app-label" htmlFor="year-select">
                  Year:
                </label>
                <select
                  className="app-select"
                  name="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(+e.target.value)}
                >
                  {yearsRange?.map((year) => (
                    <option value={year} key={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex place-content-center">
              <Link
                className="block w-fit"
                href={`result/${selectedCar}/${selectedYear}`}
              >
                <button
                  className="app-button place-content-center"
                  disabled={!selectedCar || !selectedYear}
                >
                  NEXT
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
