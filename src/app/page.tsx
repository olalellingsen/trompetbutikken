// import Image from "next/image";
// import img from "@/public/lotus.jpg";

import News from "@/components/News";

export default function Home() {
  return (
    <section>
      <div className="py-10 text-center">
        <h1>Velkommen til Trompetbutikken!</h1>

        {/* <p>Vi er en av landets fremste butikker osv osv osv</p>
        <br />

        <p className="font-bold">Åpningstider:</p>
        <p>Tirsdager og torsdager 10.00-15.00</p> */}
      </div>
      {/* <Image
        src={img}
        alt="Trompetbutkken"
        height={200}
        width={400}
        className="absolute top-0 left-0 h-screen w-screen object-cover z-[-10]"
      /> */}

      <News />
    </section>
  );
}
