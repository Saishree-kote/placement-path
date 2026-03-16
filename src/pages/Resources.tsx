import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import ResourceSidebar from "@/components/dashboard/ResourceSidebar";

const Resources = () => {
    return (
        <div>
            <DashboardNavbar title="Resources" />
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground">Learning Resources</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Curated free resources matched to your skill gaps — updated based on your profile
                    </p>
                </div>
                <ResourceSidebar />
            </div>
        </div>
    );
};

export default Resources;