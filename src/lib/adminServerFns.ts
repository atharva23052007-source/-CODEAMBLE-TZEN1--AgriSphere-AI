import { createServerFn } from "@tanstack/react-start";
import {
  storeAuthenticateAdmin,
  adminGetOverview,
  adminGetFarmers,
  adminAddFarmer,
  adminVerifyFarmerLand,
  adminLinkFarmerScheme,
  adminGetLandExtracts,
  adminAuditLandExtract,
  adminGetAppraisals,
  adminUpdateAppraisal,
  adminGetActivity,
  type FarmerRecord,
} from "./mongodb";

// ---------- Auth Server Functions ----------

export const loginSuperAdmin = createServerFn({ method: "POST" })
  .validator((data: { email: string; pass: string }) => data)
  .handler(async ({ data }) => {
    return await storeAuthenticateAdmin(data.email, data.pass);
  });

// ---------- Read Functions ----------

export const getAdminOverview = createServerFn({ method: "GET" }).handler(async () => {
  return await adminGetOverview();
});

export const getAdminFarmers = createServerFn({ method: "GET" }).handler(async () => {
  return await adminGetFarmers();
});

export const getAdminLandExtracts = createServerFn({ method: "GET" }).handler(async () => {
  return await adminGetLandExtracts();
});

export const getAdminAppraisals = createServerFn({ method: "GET" }).handler(async () => {
  return await adminGetAppraisals();
});

export const getAdminActivity = createServerFn({ method: "GET" }).handler(async () => {
  return await adminGetActivity();
});

// ---------- Mutation Functions ----------

export const addAdminFarmer = createServerFn({ method: "POST" })
  .validator((data: Omit<FarmerRecord, "id">) => data)
  .handler(async ({ data }) => {
    const result = await adminAddFarmer(data);
    return result;
  });

export const verifyAdminFarmerLand = createServerFn({ method: "POST" })
  .validator((data: { farmerId: string }) => data)
  .handler(async ({ data }) => {
    await adminVerifyFarmerLand(data.farmerId);
    return { ok: true };
  });

export const linkAdminFarmerScheme = createServerFn({ method: "POST" })
  .validator((data: { farmerId: string; schemeName: string }) => data)
  .handler(async ({ data }) => {
    await adminLinkFarmerScheme(data.farmerId, data.schemeName);
    return { ok: true };
  });

export const auditAdminLandExtract = createServerFn({ method: "POST" })
  .validator((data: { extractId: string }) => data)
  .handler(async ({ data }) => {
    await adminAuditLandExtract(data.extractId);
    return { ok: true };
  });

export const approveAdminAppraisal = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await adminUpdateAppraisal(data.id, "Approved");
    return { ok: true };
  });

export const rejectAdminAppraisal = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await adminUpdateAppraisal(data.id, "Rejected");
    return { ok: true };
  });

