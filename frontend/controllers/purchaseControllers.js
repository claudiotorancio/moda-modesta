// import purchaseService from "../services/purchaseService";
exports.buyProduct = async (req, res) => {
  try {
    const purchaseData = req.body;
    const result = await purchaseService.processPurchase(purchaseData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
