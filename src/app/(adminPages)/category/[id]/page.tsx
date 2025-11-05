import domin from "@/app/utils/Domin";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { TCategory } from "@/app/validation/categoryValidation";

const CategoryDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  let category: TCategory = { title: "", description: "" };
  let error = null;

  try {
    const response = await fetch(`${domin}/api/category/${id}`, {
      cache: "no-store", // Important for dynamic data
    });

    if (!response.ok) {
      error = `Failed to fetch category: ${response.status}`;
    } else {
      const data = await response.json();
      category = data.category;

      if (!category) {
        error = "category not found";
      }
    }
  } catch (err) {
    console.error("Fetch error:", err);
    error = "Failed to fetch category from API";
  }


  if (error) {
    return (
      <div className="min-h-screen  p-4">
        <div className="container mx-auto max-w-4xl">
          <div className=" border rounded-lg shadow-sm p-6 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              category ID: {id}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4">
      <div>
        <Link
          href="/category"
          //   icon={ChevronLeft}
          //   label={"Back"}
          //   path={"/categorys"}
        >
          categories page <ChevronLeft />{" "}
        </Link>
      </div>
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card border rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-6">{category.title}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">category Details</h2>
              <div className="space-y-3">
                <div>
                  <strong>Description:</strong>
                  <p className="mt-1">{category.description} </p>
                </div>
                <div></div>
              </div>
            </div>

            {/* <div className="space-y-4">
              {category.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={category.image} alt={category.name} />
              ) : (
                "this category does not have photo"
              )}
              <h2 className="text-xl font-semibold">category ID</h2>
              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm break-all">{id}</code>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailsPage;
