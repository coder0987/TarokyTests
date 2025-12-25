import type { SimplifiedRoom } from "@/types";
import { romanize } from "@/utils";

type RoomBoxProps = {
  simplifiedRoom: SimplifiedRoom;
  roomId: string;
  onClick: (e: React.MouseEvent) => void;
  onJoinAudience: (e: React.MouseEvent) => void;
};

const RoomBox: React.FC<RoomBoxProps> = ({
  simplifiedRoom,
  roomId,
  onClick,
  onJoinAudience,
}) => {
  const title = [
    ...simplifiedRoom.usernames,
    simplifiedRoom.audienceCount > 0
      ? `${simplifiedRoom.audienceCount} Audience member${
          simplifiedRoom.audienceCount === 1 ? "" : "s"
        }`
      : null,
    "Click to play",
    "Right click to join audience",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div
      id={`roomCard${roomId}`}
      title={title}
      onClick={onClick}
      onContextMenu={
        simplifiedRoom.count > 0 ? onJoinAudience : undefined
      }
      className="
        bg-white
        cursor-pointer select-none
        border border-black rounded-lg p-4
        font-serif
        mx-auto my-2
        max-w-[90%]
        sm:max-w-[80%] sm:m-2
        md:max-w-[50%]
        lg:max-w-[30%]
      "
    >
      {/* Room number */}
      <div
        id={`roomNum${roomId}`}
        className="
          flex justify-center
          text-[3rem]
          font-serif
        "
      >
        {roomId.replace(/(\d+)$/, (_, digits) => romanize(Number(digits)))}
      </div>

      {/* Player count dots */}
      <span
        aria-label={`${simplifiedRoom.count} player${
          simplifiedRoom.count === 1 ? "" : "s"
        }`}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className="mr-1">
            {i < simplifiedRoom.count ? "●" : "○"}
          </span>
        ))}
      </span>
    </div>
  );
};

export default RoomBox;
