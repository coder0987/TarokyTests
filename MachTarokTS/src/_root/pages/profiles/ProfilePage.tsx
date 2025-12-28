import { useParams } from "react-router-dom";

const ProfilePage = () => {
    const { slug } = useParams<{ slug: string }>();

    // TODO: Fetch information from the server
    // TODO: Display fetched information
    // TODO: Styling

    return (
        <>
            {slug}
        </>
    );
}

export default ProfilePage;