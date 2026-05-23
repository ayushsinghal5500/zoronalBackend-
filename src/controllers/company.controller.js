import Company from "../models/company.model.js";
import cloudinary from "../config/cloudinary.js";


// CREATE COMPANY
export const createCompany = async (req, res) => {
  try {
    const { companyName, location, foundedOn, city, description } = req.body;

    // Validation
    if (!companyName || !location || !foundedOn || !city) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing company
    const existingCompany = await Company.findOne({
      companyName: companyName.trim(),
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company already exists",
      });
    }

    // Handle logo file with Cloudinary Buffer Upload (Memory Storage)
    let logoPath = "";
    if (req.file) {
      try {
        console.log("DEBUG: Uploading buffer to Cloudinary...");
        
        // Use upload_stream for memory buffers
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "zoronal",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        logoPath = uploadResult.secure_url;
        console.log("DEBUG: Cloudinary Upload Success (Memory):", logoPath);
      } catch (uploadError) {
        console.error("DEBUG: Cloudinary Upload Failed:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Image upload to Cloudinary failed",
        });
      }
    }

    // Create company
    const company = await Company.create({
      companyName,
      location,
      foundedOn,
      city,
      description,
      logo: logoPath,
    });

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });

  } catch (error) {
    console.log("Create Company Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let filter = {};

    // Search by company name
    if (search) { 
      filter.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } }
      ];
    }

    const totalCompanies = await Company.countDocuments(filter);
    const companies = await Company.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      total: totalCompanies,
      page: pageNum,
      limit: limitNum,
      data: companies
    });
  } catch (error) {
    console.log("Get All Companies Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSingleCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.log("Get Single Company Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
