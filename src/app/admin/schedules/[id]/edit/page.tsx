import AddSchedulePage from "@/app/admin/add-schedule/page";

export default function EditSchedulePage({ params }: { params: { id: string } }) {
    return <AddSchedulePage mode="view" scheduleId={params.id} />;
}