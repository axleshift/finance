import invoiceModel from "../model/invoiceModel.js";

const getMonthlySalesAndRevenue = async () => {
  try {
    // Define months for placeholder data
    const months = [
      { month: 1, name: "January" },
      { month: 2, name: "February" },
      { month: 3, name: "March" },
      { month: 4, name: "April" },
      { month: 5, name: "May" },
      { month: 6, name: "June" },
      { month: 7, name: "July" },
      { month: 8, name: "August" },
      { month: 9, name: "September" },
      { month: 10, name: "October" },
      { month: 11, name: "November" },
      { month: 12, name: "December" },
    ];

    // Perform aggregation
    const monthlyData = await invoiceModel.aggregate([
      // Stage 1: Filter for Paid invoices
      { $match: { status: "Paid" } },

      // Stage 2: Unwind the products array
      { $unwind: "$products" },

      // Stage 3: Group by year and month, calculate total revenue and sales
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalAmount" }, // Sum up total invoice amount
          totalSales: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ["$products.quantity", 0] },
                    { $gt: ["$products.price", 0] },
                  ],
                },
                { $multiply: ["$products.quantity", "$products.price"] },
                0,
              ],
            }, // Sum sales from products, ensuring both quantity and price are valid
          },
        },
      },

      // Stage 4: Project to a readable format
      {
        $project: {
          year: "$_id.year",
          month: "$_id.month",
          totalRevenue: 1,
          totalSales: 1,
          _id: 0,
        },
      },

      // Stage 5: Sort results by year and month
      { $sort: { year: 1, month: 1 } },
    ]);

    // Combine results with placeholders for missing months
    const dataWithAllMonths = months.map((m) => {
      // Find the corresponding month data
      const monthData = monthlyData.find((d) => d.month === m.month);
      return {
        month: m.name,
        year: monthData?.year || new Date().getFullYear(), // Ensure correct year
        totalRevenue: monthData?.totalRevenue || 0, // Default to 0 if no data
        totalSales: monthData?.totalSales || 0, // Default to 0 if no data
      };
    });

    return dataWithAllMonths;
  } catch (error) {
    console.error("Error fetching monthly sales and revenue:", error);
    return [];
  }
};

export { getMonthlySalesAndRevenue };
