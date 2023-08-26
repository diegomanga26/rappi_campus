import { createProduct } from "../versions/product_admin_version/product_actions.mjs";
import { validationResult, siguienteId, con } from "./mocks";

describe("createProduct", () => {
  test("valid product creation", async () => {
    // Mock the necessary functions
    validationResult.mockReturnValue({ isEmpty: () => true });
    siguienteId.mockReturnValue(1);
    con.mockReturnValue({ collection: { insertOne: jest.fn(() => ({ insertedId: 1 })) } });

    // Call the function
    await createProduct(req, res);

    // Assert that the functions were called as expected
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(siguienteId).toHaveBeenCalledWith('producto');
    expect(con).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ insertedId: 1 });
  });

  test("invalid product creation due to validation errors", async () => {
    // Mock the necessary functions
    validationResult.mockReturnValue({ isEmpty: () => false, array: () => [{ msg: 'Validation error' }] });

    // Call the function
    await createProduct(req, res);

    // Assert that the functions were called as expected
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: [{ msg: 'Validation error' }] });
  });

  test("error during database insertion", async () => {
    // Mock the necessary functions
    validationResult.mockReturnValue({ isEmpty: () => true });
    siguienteId.mockReturnValue(1);
    con.mockReturnValue({ collection: { insertOne: jest.fn(() => { throw new Error('Database insertion error'); }) } });

    // Call the function
    await createProduct(req, res);

    // Assert that the functions were called as expected
    expect(validationResult).toHaveBeenCalledWith(req);
    expect(siguienteId).toHaveBeenCalledWith('producto');
    expect(con).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('error');
  });
});
