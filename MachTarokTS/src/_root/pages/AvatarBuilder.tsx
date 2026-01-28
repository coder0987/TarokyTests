import { PlayerAvatar } from "@/types";
import Avatar from "./Avatar";

const AvatarBuilder = () => {
    const avatarInfo: PlayerAvatar = {
        backgroundColor: "#ffffff"
    };

    return (
        <div className="avatar-container">
            <Avatar info={avatarInfo} />
            <p>Color picker</p>
        </div>
    );
}

export default AvatarBuilder;