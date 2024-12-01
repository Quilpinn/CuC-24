import handleShare from "@/services/handleShare"
import PublisherLink from "./publisherLink"

export default function CommentPost({post}) {

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-4/5 mb-6" key={post.EVENT_QID}>
            {/* Post Heading */}
            <h2 className="text-xl font-bold mb-2 text-gray-800">{post.HEADING}</h2>

            {/* Post Content */}
            <p className="text-gray-600">{post.CONTENT}</p>

            {/* Post Picture */}
            {post.PICTURE_URL && (
                <img
                    src={post.PICTURE_URL}
                    alt={post.HEADING}
                    className="w-full h-60 object-cover rounded mt-4"
                />
            )}

            {/* Post Timestamp */}
            <div className="text-gray-400 text-sm mt-3">
                Geposted am:{" "}
                {new Date(post.TIMESTAMP).toLocaleString("de-DE", {
                    dateStyle: "long",
                    timeStyle: "short",
                })}
            </div>

            {/* Details Button */}
            <div className="flex gap-4 mt-4">
                <a
                    href={`/postDetails/${post.EVENT_QID}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Details ansehen
                </a>
            </div>
            <PublisherLink userUuid={post.CREATED_BY_UUID}/>
        </div>
    )
}