import EditCategoryForm from "@/app/_Components/Category/EditCategoryForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

const EditCategoryPage = async ({ params }: EditProductPageProps) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <div>
      <EditCategoryForm id={id} />
    </div>
  );
};

export default EditCategoryPage;
