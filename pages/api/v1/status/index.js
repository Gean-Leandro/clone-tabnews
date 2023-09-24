function status(request, response) {
  response.status(200).json({ chave: "Você é fera de mais!" });
}

export default status;
