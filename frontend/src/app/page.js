// import Image from "next/image";

async function Feed(props) {
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const feed = fetch(`${apiUrl}/api/v1/feed`)

  return (
    <div className='flex flex-col items-center w-full py-5' {...props}>
      {feed.map(post => (
        <div className="flex flex-col items-center" key={post.name} >
          <div className="font-bold text-center text-xl">{post.name}</div>
          <div className="italic text-center text-lg">{post.text}</div>
          <Image src={post.image} alt="post" className="object-cover rounded-full mt-5 mb-3" width={300} height={300} />
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div>Test: Ich bin online!</div>
  );
}
