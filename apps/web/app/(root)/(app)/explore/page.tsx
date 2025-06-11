import Link from "next/link";

export const metadata = {
  title: "Explore",
};

function TodaysNews() {
  const news = [
    {
      headline: "Russia launches one of war's largest air attacks on Kyiv",
      description:
        "Russia has carried out one of its largest airstrike campaigns on Kyiv in over three years of conflict, according to authorities. Among the targets hit was a maternity ward in Odesa, underscoring the serious humanitarian impact of the strikes.",
      date: "2023-10-01",
    },
    {
      headline: "Tragic school shooting in Graz, Austria",
      description:
        "A devastating shooting at a secondary school in Graz resulted in 10 deaths—including the shooter, a 21-year-old former student—and 12 injuries. The incident is being investigated as the deadliest school shooting in the country’s history. Austria has declared three days of national mourning and is organizing vigils in response.",
      date: "2023-10-01",
    },
    {
      headline: "RBI makes bold interest rate cut to fuel growth in India",
      description:
        "India’s central bank, the RBI, has implemented its most significant rate cut in five years, aiming for a growth target of 7–8%. While this is seen as a proactive measure to boost employment and GDP, analysts warn it may reduce flexibility in managing future inflation pressures.",
      date: "2023-10-01",
    },
  ];

  return (
    <div className="p-4 mt-4 bg-white rounded-md w-full">
      <h3 className="text-lg font-semibold">Today's News</h3>
      <p className="text-sm text-gray-500">
        Explore the latest news and updates
      </p>
      <div>
        <ul className="mt-4 space-y-2 grid">
          {news.map((item, index) => (
            <Link href={`/news/${item.date}`} key={index}>
              <li
                key={index}
                className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <h4 className="font-semibold">{item.headline}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Trending() {
  return (
    <div className="p-4 mt-4 bg-white rounded-md w-full">
      <h3 className="text-lg font-semibold">Trending</h3>
      <p className="text-sm text-gray-500">Explore what's tending in India</p>
      <div>
        <ul className="mt-4 space-y-2 grid">
          {/* {news.map((item, index) => ( */}
          {/*   <Link href={`/news/${item.date}`} key={index}> */}
          {/*     <li */}
          {/*       key={index} */}
          {/*       className="p-2 bg-gray-100 rounded-md hover:bg-gray-200" */}
          {/*     > */}
          {/*       <h4 className="font-semibold">{item.headline}</h4> */}
          {/*       <p className="text-sm text-gray-600 line-clamp-2"> */}
          {/*         {item.description} */}
          {/*       </p> */}
          {/*     </li> */}
          {/*   </Link> */}
          {/* ))} */}
        </ul>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <div className="w-2xl">
      <TodaysNews />
      <Trending />
    </div>
  );
}
