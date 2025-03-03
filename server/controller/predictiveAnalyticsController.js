import expressAsyncHandler from "express-async-handler";
import * as tf from "@tensorflow/tfjs";

const exampleData = [
  {
    distance: 100,
    weight: 10,
    cost: 1000,
  },
  {
    distance: 200,
    weight: 20,
    cost: 2000,
  },
  {
    distance: 300,
    weight: 30,
    cost: 3000,
  },
  {
    distance: 400,
    weight: 40,
    cost: 4000,
  },
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
  const ys = tf.tensor1d(labels);

  // Define Model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [2] }));
  model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

  // Train Model
  await model.fit(xs, ys, { epochs: 100 });
  console.log("Model trained successfully!");

  return model;
};

let trainedModel;

trainModel().then((model) => (trainedModel = model));

const getPredictiveAnalytics = expressAsyncHandler(async (req, res) => {
  if (!trainedModel)
    return res.status(500).send("Model not trained yet. Try again later.");

  const { distance, weight, userId } = req.body;

  const input = tf.tensor2d([[distance, weight]]);

  const prediction = trainedModel.predict(input);

  const output = prediction.dataSync()[0];

  res.status(200).json({
    success: true,
    message: "Predictive Analytics Data",
    estimatedCost: output,
  });
});

export { getPredictiveAnalytics };
