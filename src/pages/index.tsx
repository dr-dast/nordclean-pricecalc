import { useState, ChangeEvent, useEffect, FormEvent } from "react";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faTruckMoving } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Define types for the state
type CleaningType = "hemstadning" | "flyttstadning";
type FrequencyType = "one-time" | "weekly" | "bi-weekly";
type TimeOfDayType = "morning" | "afternoon" | "night";

export default function Home() {
  const [homeSize, setHomeSize] = useState<string>("");
  const [cleaningType, setCleaningType] = useState<CleaningType>("hemstadning");
  const [frequency, setFrequency] = useState<FrequencyType>("weekly");
  const [price, setPrice] = useState<number | string>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    calculatePrice();
  }, [homeSize, cleaningType, frequency]); // Recalculate price when these dependencies change

  const selectCleaningType = (type: CleaningType) => {
    setCleaningType(type);
    if (type === "flyttstadning") {
      setFrequency("one-time"); // Set to one-time for 'flyttstadning'
    } else {
      setFrequency("weekly"); // Reset to weekly for 'hemstadning'
    }
    // Reset price when changing cleaning type
    setPrice(0);
  };

  const calculatePrice = () => {
    let calculatedPrice: number | string = 0;
    const size = parseInt(homeSize) || 0;

    // Define the pricing brackets for 'hemstäd'
    const hemstadPrices = {
      weekly: [
        { max: 79, price: 680 },
        { max: 109, price: 905 },
        { max: 149, price: 1132 },
        { max: 189, price: 1358 },
        { max: Infinity, price: 1585 }, // Use Infinity for sizes greater than 189
      ],
      biWeekly: [
        { max: 79, price: 695 },
        { max: 109, price: 925 },
        { max: 149, price: 1157 },
        { max: 189, price: 1388 },
        { max: Infinity, price: 1620 },
      ],
      oneTime: [
        { max: 79, price: 999 },
        { max: 109, price: 1249 },
        { max: 149, price: 1499 },
        { max: 189, price: 1749 },
        { max: Infinity, price: 1999 },
      ],
    };

    const flyttstadPrices = [
      { max: 40, price: 1588 },
      { max: 50, price: 1788 },
      { max: 60, price: 2288 },
      { max: 70, price: 2488 },
      { max: 80, price: 2788 },
      { max: 90, price: 3088 },
      { max: 100, price: 3388 },
      { max: 110, price: 3588 },
      { max: 120, price: 3788 },
      { max: 130, price: 3988 },
      { max: 140, price: 4288 },
      { max: 150, price: 4488 },
      { max: 160, price: 4688 },
      { max: 170, price: 4888 },
      { max: 180, price: 5088 },
      { max: 190, price: 5288 },
      { max: 200, price: 5488 },
      { max: Infinity, price: -1 }, // Use -1 as a code for "Request a quote"
    ];

    let priceBracket;
    // Check the cleaning type, if it's not 'hemstadning', return early

    if (cleaningType === "hemstadning") {
      if (frequency === "weekly") {
        priceBracket = hemstadPrices.weekly;
      } else if (frequency === "bi-weekly") {
        priceBracket = hemstadPrices.biWeekly;
      } else {
        priceBracket = hemstadPrices.oneTime;
      }
    } else if (cleaningType === "flyttstadning") {
      priceBracket = flyttstadPrices;
      // Special handling for "flyttstädning" when home size is over 200 kvm
      if (size > 200) {
        calculatedPrice = "Begär offert";
        setPrice(calculatedPrice);
        return;
      }
    }

    // Find the matching price bracket
    const matchingBracket = priceBracket!.find(
      (bracket) => size <= bracket.max
    );
    if (matchingBracket) {
      calculatedPrice = matchingBracket.price;
      // If the bracket price is -1, it means to "Request a quote"
      if (calculatedPrice === -1) {
        calculatedPrice = "Begär offert";
      }
    }

    setPrice(calculatedPrice);
  };

  const handleHomeSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHomeSize(event.target.value);
  };

  const handleFrequencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFrequency(event.target.value as FrequencyType);
  };

  //   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();

  //     // Use URLSearchParams to construct the data
  //   const formData = new URLSearchParams();
  //   formData.append('name', name);
  //   formData.append('email', email);
  //   formData.append('phone', phone);
  //   formData.append('address', address);
  //   formData.append('message', `Typ av städ: ${cleaningType}, Hur ofta: ${frequency}, Kvadratmeter: ${homeSize}, Prisförslag: ${price}`);

  //   // Make an API request to Web3Forms
  //   try {
  //     const response = await fetch("https://api.web3forms.com/submit", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: formData,
  //     });

  //     const result = await response.json();
  //     if (result.success) {
  //       console.log("Form submitted successfully:", result);
  //       // Handle success (e.g., display a thank you message)
  //     } else {
  //       console.error("Submission failed:", result.message);
  //       // Handle error (e.g., display an error message)
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //   }
  // };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <Head>
        <title>Nordclean - Priskalkyl</title>
      </Head>
      <h1 className="text-6xl text-blue-600 mb-4 font-bold">
        Nordclean Priskalkyl
      </h1>
      <h2 className="text-4xl text-gray-900 mb-4 font-bold">
        Få ditt pris direkt och bli kontaktad av oss.
      </h2>
      <h3 className="text-2xl text-gray-700 font-semibold">
        Välj typ av städning och fyll i uppgifterna nedan.
      </h3>
      <form
        action="https://api.web3forms.com/submit"
        method="POST"
        className="mt-12 w-full max-w-lg space-y-4"
      >
        <input
          type="hidden"
          name="access_key"
          value="d0b0bfcc-a388-4c2c-8c04-f97ed1649331"
        ></input>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => selectCleaningType("hemstadning")}
            className={`w-48 h-48 ${
              cleaningType === "hemstadning" ? "bg-blue-400" : "bg-gray-400"
            }`}
          >
            {/* Replace 'IconHere' with your actual icon component or element */}
            <FontAwesomeIcon icon={faHouse} size="2x" />
            <div>Hemstäd</div>
          </button>
          <button
            type="button"
            onClick={() => selectCleaningType("flyttstadning")}
            className={`w-48 h-48 ${
              cleaningType === "flyttstadning" ? "bg-blue-400" : "bg-gray-400"
            }`}
          >
            {/* Replace 'IconHere' with your actual icon component or element */}
            <FontAwesomeIcon icon={faTruckMoving} size="2x" />
            <div>Flyttstäd</div>
          </button>
        </div>
        <div>
          <label
            htmlFor="homeSize"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Kvadratmeter:
          </label>
          <input
            type="number"
            id="homeSize"
            value={homeSize}
            onChange={handleHomeSizeChange}
            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Hur ofta vill du ha städ?:
          </label>
          <select
            value={frequency}
            onChange={handleFrequencyChange}
            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md"
            required
            disabled={cleaningType === "flyttstadning"} // Disable the dropdown if cleaningType is flyttstadning
          >
            {cleaningType === "hemstadning" && (
              <>
                <option value="weekly">Varje Vecka</option>
                <option value="bi-weekly">Varannan Vecka</option>
              </>
            )}
            <option value="one-time">En gång</option>
          </select>
        </div>

        {/* <div>
                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg">
                        Beräkna Pris
                    </button>
                </div> */}
        <div>
          <h2 className="text-3xl text-gray-900 font-semibold">
            {typeof price === "number"
              ? `Prisförslag: ${price} kr`
              : `Prisförslag: ${price}`}
          </h2>
        </div>

        <input
          type="text"
          name="Namn"
          className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md"
          placeholder="Namn"
          required
        />
        <input
          type="email"
          name="Email"
          className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md"
          placeholder="Email"
          required
        />
        <input
          type="tel"
          name="Telefon"
          className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md"
          placeholder="Telefon"
          required
        />
        <input
          type="text"
          name="Adress"
          className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md"
          placeholder="Adress"
          required
        />
        <input
          type="number"
          name="Postnummer"
          className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md"
          placeholder="Postnummer"
          required
        />

        <input type="hidden" name="typ_av_städ" value={cleaningType} />
        <input type="hidden" name="Frekvens" value={frequency} />
        <input type="hidden" name="kvadratmeter" value={homeSize} />
        <input type="hidden" name="prisförslag" value={price.toString()} />

        <div className="h-captcha" data-captcha="true"></div>

        <button
          type="submit"
          className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg"
        >
          Skicka
        </button>
      </form>
    </main>
  );
}
