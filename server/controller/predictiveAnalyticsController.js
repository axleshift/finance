import expressAsyncHandler from "express-async-handler";
import * as tf from "@tensorflow/tfjs";

const exampleData = [
  { distance: 100, weight: 10, cost: 1000 },
  { distance: 200, weight: 20, cost: 2000 },
  { distance: 300, weight: 30, cost: 3000 },
  { distance: 400, weight: 40, cost: 4000 },
];

const trainModel = async () => {
  if (exampleData.length < 2) {
    console.log("Not enough data to train. Add more records!");
    return null;
  }

  // Prepare training data
  const inputs = exampleData.map((d) => [d.distance, d.weight]);
  const labels = exampleData.map((d) => d.cost);

  const xs = tf.tensor2d(inputs);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  // Define Model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [2] }));
  model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

  // Train Model
  await model.fit(xs, ys, { epochs: 100 });
  console.log("Model trained successfully!");

  return model;
};

let trainedModel = null;

// Ensure the model is trained before allowing predictions
const initializeModel = async () => {
  trainedModel = await trainModel();
};

initializeModel();

const getPredictiveAnalytics = expressAsyncHandler(async (req, res) => {
  if (!trainedModel) {
    return res.status(500).json({
      success: false,
      message: "Model not trained yet. Try again later.",
    });
  }

  try {
    const { distance, weight } = req.body;



    if (distance == null || weight == null) {
      return res.status(400).json({
        success: false,
        message: "Missing required inputs: distance and weight",
      });
    }

    const input = tf.tensor2d([[distance, weight]]);

    // Ensure proper extraction of Tensor values
    const prediction = trainedModel.predict(input);
    const outputArray = await prediction.data(); // Ensure we extract the value properly
    const estimatedCost = outputArray[0];

    res.status(200).json({
      success: true,
      message: "Predictive Analytics Data",
      estimatedCost: estimatedCost
    });
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while making the prediction.",
    });
  }
});

export { getPredictiveAnalytics };
