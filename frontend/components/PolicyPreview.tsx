export function PolicyPreview() {
    return (
        <div className="bg-white/50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-semibold mb-2">Active Policy</h3>
            <code className="text-xs text-gray-500 block">
                MAX_PAYOUT = 1000 USDC<br />
                REQUIRE_VERIFICATION = TRUE
            </code>
        </div>
    );
}
