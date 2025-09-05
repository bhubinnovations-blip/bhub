"use client";

interface Props {
  email: string;
  name: string;
  phone: string;
  place: string;
}

export default function DetailsCard({ email, name, phone, place }: Props) {
  return (
    <div className="bg-neutral-800 p-4 rounded-lg space-y-2">
      <p>Email: {email}</p>
      <p>Name: {name}</p>
      <p>Phone: {phone}</p>
      <div className="flex justify-between items-center">
        <p>Deliver to: {place}</p>
        <button
          className="text-orange-400"
          onClick={() => window.location.assign("/places")}
        >
          Edit
        </button>
      </div>
    </div>
  );
}