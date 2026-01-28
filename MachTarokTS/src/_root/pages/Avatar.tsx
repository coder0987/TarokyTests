import { PlayerAvatar } from "@/types";
//import CircleBg from "@/content/layered-avatars/circle-bg.svg?react";
import Scene6 from "@/content/layered-avatars/scene6-a.svg?react";

const Avatar = ({ info }: { info: PlayerAvatar }) => {
    console.log("backgroundColor:", JSON.stringify(info.backgroundColor));

    return (
        <div className="avatar-container">
            <Scene6 />
        </div>
    );
}

export default Avatar;