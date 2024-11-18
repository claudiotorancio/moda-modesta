export function prodcutFormHtml() {
  return `
    <div>
      <div class="text-center">
        <div class="card-header mb-2">
          <h3 style="font-weight: bold;">Agregar producto</h3>
        </div>
        <p>Modo seleccion de imagenes:</p>
        <p>a- Seleccionar una sola imagen</p>
        <p>b- Seleccionar dos (2) imagenes de una vez para efecto carrousel.</p>
        <br>
        <div class="card-body w-100">
          <form id="form" action="/api/createProduct" enctype="multipart/form-data" method="POST" data-form>
        <div class="form-row">
            
            <!-- Fila 1 -->
            <div class="row">
              <div class="col-md-6">
                <label for="miMenuDesplegable">Sección</label>
                <select class="form-control mb-3 p-2" id="miMenuDesplegable" name="section">
                  <option value="vestidos">Vestidos</option>
                  <option value="polleras">Polleras</option>
                  <option value="diversos">Diversos</option>
                </select>
              </div>
              
              <div class="col-md-6">
                <label>Imágenes</label>
                <input class="form-control p-2" type="file" name="images" data-imageUrls multiple required accept="image/*">
              </div>
            </div>

            <!-- Fila 2 -->
            <div class="row mt-3">
              <div class="col-md-6">
                <input class="form-control p-2" type="text" placeholder="Nombre del producto" name="name" required data-name>
              </div>
              
              <div class="col-md-6">
                <input class="form-control p-2" type="number" placeholder="Precio del producto" name="price" required data-price step="0.01">
              </div>
            </div>

            <!-- Fila 3 -->
            <div class="row mt-3">
              <div class="col-md-12">
                <textarea class="form-control p-2" placeholder="Descripción" name="description" required data-description></textarea>
              </div>
            </div>
          
          </div>
          <div class="text-center">
        <div class="card-header mt-3 mb-3">
          <label>
            <input type="checkbox" id="enableDiscount" />
            Activar descuento
          </label>
          </div>
          

          <div class="form-row mb-3">
            <div id="discountFields" style="display: none;">
              <div class="row">
                <!-- Porcentaje de descuento -->
                <div class="col-md-6">
                  <label for="discountPercentage">Porcentaje de descuento:</label>
                  <input class="form-control p-2" type="number" id="discountPercentage" name="discount" min="0" max="100" disabled data-discount />
                </div>
                
                <!-- Fecha de expiración del descuento -->
                <div class="col-md-6">
                  <label for="discountExpiration">Fecha de expiración del descuento:</label>
                  <input class="form-control p-2" type="date" id="discountExpiration" name="discountExpiry" disabled data-discount-expiry/>
                </div>
              </div>
            </div>
          </div>



            <!-- Talles disponibles y cantidad de stock -->
         
            <div class="form-group mb-4 sizes-container"> <!-- Añade una clase aquí -->
               <label for="variation_1">Talles y stock disponibles</label>
              <div class="form-row">
                <div class="col-center flex mt-2">
                  <div class="form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 1" name="sizes" id="talle1">
                    <label class="form-check-label" for="talle1">Talle 1</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle1>
                  </div>
                  <div class="form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 2" name="sizes" id="talle2">
                    <label class="form-check-label" for="talle2">Talle 2</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle2>
                  </div>
                  <div class="form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 3" name="sizes" id="talle3">
                    <label class="form-check-label" for="talle3">Talle 3</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle3>
                  </div>
                  <div class="form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 4" name="sizes" id="talle4">
                    <label class="form-check-label" for="talle4">Talle 4</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle4>
                  </div>
                  <div class="form-check-inline me-3">
                    <input class="form-check-input" type="checkbox" value="Talle 5" name="sizes" id="talle5">
                    <label class="form-check-label" for="talle5">Talle 5</label>
                    <input type="number" min="0" class="form-control mt-2" placeholder="Stock" data-stock-talle5>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group general-stock-container d-none"> <!-- Oculto por defecto -->
  <label for="generalStock">Stock general</label>
  <input type="number" min="0" class="form-control mt-2" placeholder="Stock" id="generalStock" name="generalStock">
</div>


            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="isFeatured" name="isFeatured">
                <label class="form-check-label" for="isFeatured">Destacar producto</label>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg">Agregar</button>
          </form>
        </div>
      </div>
    </div>
  `;
}
