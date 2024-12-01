import handleShare from "@/services/handleShare";
import PublisherLink from "./publisherLink";

export default function EventPost({post}) {
    const participants = post.PARTICIPANTS
    ? post.PARTICIPANTS.split("; ")
    : null;

    return (
        <div
            className="bg-white shadow-lg rounded-lg p-6 w-4/5 mb-6"
            key={post.HEADING}
        >
            {/* Heading */}
            <h2 className="text-xl font-bold mb-2 text-gray-800">
                {post.HEADING}
            </h2>

            {/* Content */}
            <p className="text-gray-600 italic">{post.CONTENT}</p>

            {/* City and Date */}
            <div className="mt-4">
                <p>
                    <strong>📍 Stadt:</strong> {post.event_details.CITY}
                </p>
                <p>
                    <strong>🕒 Datum:</strong>{" "}
                    {new Date(post.event_details.EVENT_DATE).toLocaleString("de-DE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}
                    Uhr
                </p>
            </div>

            {/* Participants */}
            <div className="mt-4">
                {participants == null ? (
                    <a
                        onClick={() => addParticipant(post.EVENT_QID)}
                        href="#"
                        className="text-blue-500 hover:underline"
                    >
                        Melde dich als erster an!
                    </a>
                ) : participants.includes(getAuthentication()) ? (
                    <p>
                        Du bist dabei!{" "}
                        {participants.length - 1 > 0 &&
                            `+ ${participants.length - 1} Teilnehmer.`}
                    </p>
                ) : (
                    <p>
                        {participants.length} Teilnehmer.{" "}
                        <a
                            onClick={() => addParticipant(post.EVENT_QID)}
                            href="#"
                            className="text-blue-500 hover:underline"
                        >
                            Auch teilnehmen?
                        </a>
                    </p>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
                <a
                    href={`/postDetails/${post.EVENT_QID}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Details ansehen
                </a>
                <a
                    href="#"
                    onClick={handleShare}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
                >
                    📤 Teilen
                </a>
            </div>

            {/* Timestamp */}
            <div className="text-gray-400 text-sm mt-3">
                Geposted am:{" "}
                {new Date(post.TIMESTAMP).toLocaleString("de-DE", {
                    dateStyle: "long",
                    timeStyle: "short",
                })}
            </div>

            <PublisherLink userUuid={post.CREATED_BY_UUID}/>
        </div>
    )
}