import { prisma } from "@/db/prisma";
// { District } from "@/generated/prisma";
import { NextResponse } from "next/server";
const cities = await import("./cities.json");

export async function GET() {
  await prisma.location.deleteMany();
  await prisma.district.deleteMany();
  await prisma.region.deleteMany();

  console.log("cities", cities);
  //const districts: Partial<District>[] = [];
  
  for (const region of Object.keys(cities)) {
    await prisma.region.create({
      data: {
        region,
      },
    });
    const newRegion = await prisma.region.findFirstOrThrow({
      where: {
        region,
      },
    });

    for (const district of Object.keys(cities[region as keyof typeof cities])) {
      await prisma.district.create({
        data: {
          district,
          regionId: newRegion.id,
        },
      });
      const newDistrict = await prisma.district.findFirstOrThrow({
        where: {
          district,
          regionId: newRegion.id,
        },
      });

      const regionData = cities[region as keyof typeof cities];
      console.log('district', district);
      //console.log(regionData[district]);
      for (const location of regionData[district as keyof typeof regionData] as string[]) {
        //console.log('loc', location);
        await prisma.location.create({
          data: {
            location,
            districtId: newDistrict.id,
          },
        });
      }
    }
  }

  /*const count = Array.from({ length: 4 });
  const count2 = Array.from({ length: 5 });

  const bratislavaRegion = await prisma.region.findFirstOrThrow({
    where: {
      region: 'Bratislavský kraj',
    }
  });
  
  const kosiceRegion = await prisma.region.findFirstOrThrow({
    where: {
      region: 'Košický kraj',
    }
  });

  const numMap = {
    '1': 'I',
    '2': 'II',
    '3': 'III',
    '4': 'IV',
    '5': 'V'
  };

  for (const [i] of count.entries()) {
    console.log(i);
    districts.push({
      district: 'Košice '+ numMap[(i+1).toString() as keyof typeof numMap],
      regionId: kosiceRegion.id,
    });
  }

  for (const [i] of count2.entries()) {
    console.log(i);
    districts.push({
      district: 'Bratislava '+ numMap[(i+1).toString() as keyof typeof numMap],
      regionId: bratislavaRegion.id,
    });
  }*/

  return NextResponse.json({ result: "done" });
}
