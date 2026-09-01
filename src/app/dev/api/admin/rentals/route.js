import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";
import { corsJson, corsPreflight } from "@/lib/server/cors";

/**
 * GET — List all rentals (admin, auth-gated).
 */
export function OPTIONS(request) {
    return corsPreflight(request);
}

export async function GET(request) {
    try {
        // Verify admin via auth header
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return corsJson(request, { error: "Unauthorized." }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        let decodedClaims;
        try {
            decodedClaims = await getAdminAuth().verifyIdToken(token);
        } catch {
            return corsJson(request, { error: "Invalid or expired token." }, { status: 401 });
        }

        const isAdmin = decodedClaims.role === "admin" || decodedClaims.admin === true;
        if (!isAdmin) {
            return corsJson(request, { error: "Forbidden." }, { status: 403 });
        }

        const db = getAdminDb();
        const snapshot = await db.collection("rentals").orderBy("createdAt", "desc").get();

        const rentals = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                days: data.days,
                status: data.status,
                upfrontFeeINR: data.upfrontFeeINR,
                hoursUsed: data.hoursUsed || 0,
                billAmountINR: data.billAmountINR || 0,
                razorpayPaymentId: data.razorpayPaymentId,
                billPaymentId: data.billPaymentId,
                billPaymentLink: data.billPaymentLink,
                activatedAt: data.activatedAt ? (data.activatedAt.toDate ? data.activatedAt.toDate().toISOString() : data.activatedAt) : null,
                expiresAt: data.expiresAt ? (data.expiresAt.toDate ? data.expiresAt.toDate().toISOString() : data.expiresAt) : null,
                billGeneratedAt: data.billGeneratedAt ? (data.billGeneratedAt.toDate ? data.billGeneratedAt.toDate().toISOString() : data.billGeneratedAt) : null,
                billPaidAt: data.billPaidAt ? (data.billPaidAt.toDate ? data.billPaidAt.toDate().toISOString() : data.billPaidAt) : null,
                createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt) : null,
            };
        });

        return corsJson(request, { rentals });
    } catch (error) {
        console.error("Admin rentals fetch failed:", error.message);
        return corsJson(request, { error: "Unable to fetch rentals." }, { status: 500 });
    }
}
