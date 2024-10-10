import React, { useState } from "react";
import theme from "theme";
import {
  Theme,
  Text,
  Box,
  Section,
  Input,
  Hr,
  Button,
  Select,
} from "@quarkly/widgets";
import { Helmet } from "react-helmet";
import { GlobalQuarklyPageStyles } from "global-page-styles";
import { uploadImage, uploadCSV } from "../utils/firebaseConfig";
import Footer from "../utils/footer";
export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    color: "",
    category: "",
    isNewArrival: false,
    isBestOfSujathaReddys: false,
    price: "",
    images: null,
    embroidery: "",
    no_of_pieces: 0,
    fit: "",
  });

  const [sessionStarted, setSessionStarted] = useState(false);
  const [numProducts, setNumProducts] = useState(0);
  const [csvFileUrl, setCsvFileUrl] = useState(null);
  const [productsAdded, setProductsAdded] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const handleSessionStart = () => {
    const sessionConfirm = window.confirm(
      "Do you want to start a new session?"
    );
    if (sessionConfirm) {
      const num = prompt("How many products do you want to add?");
      if (!isNaN(num)) {
        setNumProducts(parseInt(num, 10));
        setSessionStarted(true);
        setAllProducts([]);
        setCsvFileUrl(null);
        setProductsAdded(0);
        setLoading(false);
        alert("New session started!");
      } else {
        alert("Invalid number. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files : value,
    }));
  };

  const handleUploadCSV = async () => {
    setLoading(true);

    const headerRow = [
      "ID",
      "Type",
      "SKU",
      "Name",
      "Published",
      "Is featured?",
      "Visibility in catalogue",
      "Short description",
      "Tax status",
      "Tax class",
      "In stock?",
      "Stock",
      "Backorders allowed?",
      "Sold individually?",
      "Allow customer reviews?",
      "Purchase note",
      "Regular Price",
      "Sale Price",
      "Categories",
      "Images",
      "Parent",
      "Attribute 1 name",
      "Attribute 1 value(s)",
      "Attribute 1 visible",
      "Attribute 1 global",
      "Attribute 1 default",
      "Attribute 2 name",
      "Attribute 2 value(s)",
      "Attribute 2 visible",
      "Attribute 2 global",
      "Attribute 2 default",
      "Meta: _yoast_wpseo_focuskw",
      "Meta: _yoast_wpseo_title",
      "Meta: _yoast_wpseo_metadesc",
      "Meta: details",
      "Meta: manufacture_description",
      "Meta: ship_details",
      "Position",
    ];

    const flattenedProducts = allProducts.flat();
    const csvData = flattenedProducts.map((product) => product.join(";"));
    const csvContent = [headerRow.join(";"), ...csvData].join("\n");

    const csvBlob = new Blob([csvContent], { type: "text/csv" });
    const csvFile = new File([csvBlob], "products.csv", { type: "text/csv" });

    const uploadResult = await uploadCSV(csvFile);

    if (uploadResult) {
      setCsvFileUrl(uploadResult);
      setSessionStarted(false);
      alert("CSV file uploaded successfully!");
      setAllProducts([]);
    } else {
      alert("Failed to upload CSV file.");
    }

    setFormData({
      name: "",
      shortDescription: "",
      color: "",
      category: "",
      isNewArrival: false,
      isBestOfSujathaReddys: false,
      price: "",
      images: null,
      embroidery: "",
      no_of_pieces: 0,
      fit: "",
    });

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      name,
      shortDescription,
      color,
      category,
      isNewArrival,
      isBestOfSujathaReddys,
      price,
      images,
      embroidery,
      no_of_pieces,
      fit,
    } = formData;

    const generateRandomID = () => Math.floor(1000 + Math.random() * 9000);
    const parentID = generateRandomID();
    const skuPrefix = `GN-${parentID}`;
    const categories = `${category}${isNewArrival ? ", New Arrivals" : ""}${
      isBestOfSujathaReddys ? ", Best of Sujatha Reddy's" : ""
    }`;

    const imageUrls = [];
    if (images) {
      for (const file of images) {
        const url = await uploadImage(file);
        imageUrls.push(url);
      }
    }
    const csvRows = [];

    // Parent Product Row
    const parentRow = [
      parentID, // ID
      "variable", // Type
      skuPrefix, // SKU
      name, // Name
      1, // Published
      0, // Is Featured?
      "visible", // Visibility in catalogue
      shortDescription, // Short Description
      "taxable", // Tax status
      "", // Tax Class (empty for parent)
      1, // In Stock?
      3, // Stock (for the parent, it's always 3)
      0, // Backorders allowed?
      0, // Sold individually?
      1, // Allow customer reviews?
      "Thank you so much.", // Purchase note
      price, // Regular Price
      "", // Sale Price (if any, can be added later)
      categories, // Categories
      imageUrls.join(","), // Images (comma separated)
      "", // Parent (empty for parent)
      "Color", // Attribute 1 name
      color, // Attribute 1 value(s)
      1, // Attribute 1 visible
      1, // Attribute 1 global
      color, // Attribute 1 default
      "Size", // Attribute 2 name (empty)
      "L, M, S", // Attribute 2 value(s)
      1, // Attribute 2 visible
      1, // Attribute 2 global
      "S", // Attribute 2 default
      name, // Meta: _yoast_wpseo_focuskw (using name)
      `${name} Set | Sujatha Reddy`, // Meta: _yoast_wpseo_title
      `Elevate your style with ${name} Set from Sujatha Reddy. It's made to order. Order now! `, // Meta: _yoast_wpseo_metadesc
      `"<b>Fit</b>: ${fit}<br><b>Embroidery</b>: ${embroidery}<br><b>No. of pieces</b>: ${no_of_pieces} Piece<br><b>Model is wearing</b>: S<br><b>Order type</b>: Made to order<br><b>Wash care</b>: Dry-cleaning<br>"`, // Meta: details (same for all)
      `This product will be exclusively handcrafted for you, making the colour/texture/pattern slightly vary from the image shown, due to multiple artisan-led techniques and processes involved.`, // Meta: manufacture_description
      `"<b>Delivery time</b>: 30 Days <br> Shipping is calculated offline. <br>"`, // Meta: ship_details
      0, // Position
    ];
    csvRows.push(parentRow);

    // Children Products Rows (Variations)
    ["S", "M", "L"].forEach((size) => {
      const childRow = [
        generateRandomID(), // ID for the child product
        "variation", // Type
        "", // SKU (empty for child)
        `${name} - ${color}, ${size}`, // Name
        1, // Published
        0, // Is Featured?
        "visible", // Visibility in catalogue
        "",
        "taxable", // Tax status
        "parent", // Tax class (child points to parent)
        1, // In Stock?
        3, // Stock (same as parent)
        0, // Backorders allowed?
        0, // Sold individually?
        1, // Allow customer reviews?
        "", // Purchase note
        "", // Regular Price
        "", // Sale Price,
        "", // Categories
        "", // Images
        skuPrefix, // Parent SKU
        "Color", // Attribute 1 name
        color, // Attribute 1 value(s)
        "", // Attribute 1 visible
        1, // Attribute 1 global
        "", // Attribute 1 default
        "Size", // Attribute 2 name (empty)
        size, // Attribute 2 value(s)
        1, // Attribute 2 visible
        1, // Attribute 2 global
        "", // Attribute 2 default
        "", // Meta: manufacture_description (same for all)
        "", // Meta: details (empty for children)
        "", // Meta: ship_details (same for all)
        "", // Meta: _yoast_wpseo_focuskw (empty for children)
        "", // Meta: _yoast_wpseo_title (empty for children)
        "", // Meta: _yoast_wpseo_metadesc (empty for children)
        ["S", "M", "L"].indexOf(size) + 1, // Position
      ];
      csvRows.push(childRow);
    });

    var temp = allProducts;
    temp.push(csvRows);
    setAllProducts(temp);
    console.log(allProducts);
    setProductsAdded(productsAdded + 1);

    setFormData({
      name: "",
      shortDescription: "",
      color: "",
      category: "",
      isNewArrival: false,
      isBestOfSujathaReddys: false,
      price: "",
      images: null,
      embroidery: "",
      no_of_pieces: 0,
      fit: "",
    });
    console.log(productsAdded, numProducts);
    if (productsAdded === numProducts - 1) {
      handleUploadCSV();
      setSessionStarted(false);
    } else {
      setLoading(false);
      alert(
        `Product added successfully! Total products added: ${productsAdded + 1}`
      );
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleCopyLink = () => {
    if (csvFileUrl) {
      navigator.clipboard.writeText(csvFileUrl);
      alert("CSV link copied to clipboard!");
    } else {
      alert("No URL to copy!");
    }
  };

  return (
    <Theme theme={theme}>
      <GlobalQuarklyPageStyles pageUrl="add-products" />
      <Helmet>
        <title>Add Products</title>
        <link rel="shortcut icon" href="https://i.imgur.com/crcVWqA.png" />
      </Helmet>
      <Section>
        <Box>
          <Text font="40px sans-serif" textAlign="center">
            Add Product
          </Text>
        </Box>
      </Section>
      {sessionStarted ? (
        <Section>
          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <Box min-width="100px" min-height="100px">
              <Text margin="0px 0px 0px 0px" font="24px sans-serif">
                Name
              </Text>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                display="block"
                placeholder="White Satin Dress"
                placeholder-color="Gray"
                background="white"
                margin="16px 0px 16px 0px"
                width="100%"
                border-color="#000000"
                type="text"
                required
              />
              <Hr
                min-height="10px"
                min-width="100%"
                margin="10px 0px"
                padding="4px 0px"
                border-color="#000000"
              />
            </Box>

            {/* Short Description */}
            <Box min-width="100px" min-height="100px">
              <Text margin="0px 0px 0px 0px" font="24px sans-serif">
                Short Description
              </Text>
              <Input
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                display="block"
                placeholder="White Satin Dress with Chiffon Work and Royal Blue Borders"
                placeholder-color="Gray"
                background="white"
                margin="16px 0px 16px 0px"
                width="100%"
                border-color="#000000"
                type="text"
                required
              />
              <Hr
                min-height="10px"
                min-width="100%"
                margin="10px 0px"
                padding="4px 0px"
                border-color="#000000"
              />
            </Box>

            {/* Color */}
            <Box min-width="100px" min-height="100px">
              <Text margin="0px 0px 0px 0px" font="24px sans-serif">
                Color
              </Text>
              <Input
                name="color"
                value={formData.color}
                onChange={handleChange}
                display="block"
                placeholder="Blue"
                placeholder-color="Gray"
                background="white"
                margin="16px 0px 16px 0px"
                width="100%"
                border-color="#000000"
                type="text"
                required
              />
              <Hr
                min-height="10px"
                min-width="100%"
                margin="10px 0px"
                padding="4px 0px"
                border-color="#000000"
              />
            </Box>

            {/* Category Dropdown */}
            <Box min-width="100px" min-height="100px">
              <Text margin="0px 0px 0px 0px" font="24px sans-serif">
                Category
              </Text>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                display="block"
                background="white"
                margin="16px 0px 16px 0px"
                padding="8px"
                width="100%"
                border-color="#000000"
                required
              >
                <option value="">Select Category</option>
                <option value="Lehengha">LEHENGHA</option>
                <option value="Western">WESTERN</option>
                <option value="Tunic">TUNIC</option>
                <option value="Indo-Western">INDO-WESTERN</option>
              </Select>

              {/* New Arrivals Checkbox */}
              <Box marginTop="16px">
                <input
                  type="checkbox"
                  id="new-arrivals"
                  name="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleChange}
                  style={{ marginRight: "8px" }}
                />
                <label htmlFor="new-arrivals">
                  <Text font="16px sans-serif" display="inline">
                    New Arrivals
                  </Text>
                </label>
              </Box>

              {/* Best of Sujatha Reddy's Checkbox */}
              <Box marginTop="8px">
                <input
                  type="checkbox"
                  id="best-of-sujatha-reddys"
                  name="isBestOfSujathaReddys"
                  checked={formData.isBestOfSujathaReddys}
                  onChange={handleChange}
                  style={{ marginRight: "8px" }}
                />
                <label htmlFor="best-of-sujatha-reddys">
                  <Text font="16px sans-serif" display="inline">
                    Best of Sujatha Reddy's
                  </Text>
                </label>
              </Box>

              <Hr
                min-height="10px"
                min-width="100%"
                margin="10px 0px"
                padding="4px 0px"
                border-color="#000000"
              />
            </Box>

            {/* Price */}
            <Box min-width="100px" min-height="100px">
              <Text margin="0px 0px 0px 0px" font="24px sans-serif">
                Price (₹)
              </Text>
              <Input
                name="price"
                value={formData.price}
                onChange={handleChange}
                display="block"
                placeholder="10000"
                placeholder-color="Gray"
                background="white"
                margin="16px 0px 16px 0px"
                width="100%"
                border-color="#000000"
                type="number"
                required
              />
              <Hr
                min-height="10px"
                min-width="100%"
                margin="10px 0px"
                padding="4px 0px"
                border-color="#000000"
              />
            </Box>

            {/* Fit */}

            <Box min-width="100px" min-height="100px">
              <Text margin="0px 0px 0px 0px" font="24px sans-serif">
                Fit
              </Text>
              <Select
                name="fit"
                value={formData.fit}
                onChange={handleChange}
                display="block"
                background="white"
                margin="16px 0px 16px 0px"
                padding="8px"
                width="100%"
                border-color="#000000"
                required
              >
                <option value="">Select Category</option>
                <option value="Body Fit">Body Fit</option>
                <option value="Comfort Fit">Comfort Fit</option>
              </Select>
              <Hr
                min-height="10px"
                min-width="100%"
                margin="10px 0px"
                padding="4px 0px"
                border-color="#000000"
              />
            </Box>

            {/* No. of Pieces */}

            <Box min-width="100px" min-height="100px">
              <Text margin="0px 0px 0px 0px" font="24px sans-serif">
                No. of Pieces
              </Text>
              <Input
                name="no_of_pieces"
                value={formData.no_of_pieces}
                onChange={handleChange}
                display="block"
                placeholder="3"
                placeholder-color="Gray"
                background="white"
                margin="16px 0px 16px 0px"
                width="100%"
                border-color="#000000"
                type="number"
                required
              />
              <Hr
                min-height="10px"
                min-width="100%"
                margin="10px 0px"
                padding="4px 0px"
                border-color="#000000"
              />
            </Box>

            {/* Embroidery */}

            <Box min-width="100px" min-height="100px">
              <Text margin="0px 0px 0px 0px" font="24px sans-serif">
                Embroidery
              </Text>
              <Input
                name="embroidery"
                value={formData.embroidery}
                onChange={handleChange}
                display="block"
                placeholder="Sequin and thread work"
                placeholder-color="Gray"
                background="white"
                margin="16px 0px 16px 0px"
                width="100%"
                border-color="#000000"
                type="text"
                required
              />
              <Hr
                min-height="10px"
                min-width="100%"
                margin="10px 0px"
                padding="4px 0px"
                border-color="#000000"
              />
            </Box>

            {/* Upload Images */}
            <Box min-width="100px" min-height="100px">
              <Text margin="0px 0px 0px 0px" font="24px sans-serif">
                Upload Images
              </Text>
              <Input
                name="images"
                onChange={handleChange}
                display="block"
                background="white"
                margin="16px 0px 16px 0px"
                width="100%"
                border-color="#000000"
                type="file"
                multiple
                required
              />
              <Hr
                min-height="10px"
                min-width="100%"
                margin="10px 0px"
                padding="4px 0px"
                border-color="#000000"
              />
            </Box>

            {/* Add Product Button */}
            <Button
              type="submit"
              width="25%"
              border-radius="7.5px"
              min-width="150px"
              sm-min-width="200px"
              background="#cf7031"
              disabled={loading}
            >
              {loading ? "Adding Product..." : "Add Product"}
            </Button>
          </form>
        </Section>
      ) : (
        <Section>
          <Button onClick={handleSessionStart}>Start New Session</Button>
          {csvFileUrl && (
            <Button
              width="25%"
              border-radius="7.5px"
              min-width="150px"
              sm-min-width="200px"
              background="#cf7031"
              margin="15px 15px 15px 15px"
              disabled={loading}
              onClick={handleCopyLink}
            >
              Copy CSV URL
            </Button>
          )}
        </Section>
      )}
    <Footer />
    </Theme>
  );
}
