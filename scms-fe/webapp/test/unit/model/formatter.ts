import formatter from "scmsfe/model/formatter";

// validate email unit testing
QUnit.module("validateEmail Tests",{});

QUnit.test("validateEmail function - valid emails", function(assert) {
    const validEmails = [
        "test@example.com",
        "user.name@domain.co",
        "firstname.lastname@example.com",
    ];

    validEmails.forEach(email => {
        assert.ok(formatter.validateEmail(email), `Expected '${email}' to be valid`);
    });
});

QUnit.test("validateEmail function - invalid emails", function(assert) {
    const invalidEmails = [
        "plainaddress",
        "@missingusername.com",
        "username@.com.my",
        "username@domain..com",
        "username@domain.com.",
        "username@.domain.com",
        "user@name@domain.com"
    ];

    invalidEmails.forEach(email => {
        assert.notOk(formatter.validateEmail(email), `Expected '${email}' to be invalid`);
    });
});

// token decoding testing
QUnit.module("JWT Token Decoding Tests");

QUnit.test("decodeToken function - valid token", function(assert) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ userId: 123, name: "John Doe" }));
    const signature = "signature";

    const token = `${header}.${payload}.${signature}`;

    const expectedPayload = { userId: 123, name: "John Doe" };
    const decodedPayload = formatter.decodeToken(token);

    assert.deepEqual(decodedPayload, expectedPayload, "The payload should match the expected decoded data");
});

QUnit.test("decodeToken function - invalid token format", function(assert) {
    const invalidToken = "invalidTokenFormat";

    assert.throws(
        () => formatter.decodeToken(invalidToken),
        /Invalid JWT token/,
        "Should throw an error for tokens not in the correct format"
    );
});

QUnit.test("decodeToken function - invalid base64 payload", function(assert) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const invalidPayload = "invalidBase64Payload";
    const signature = "signature";

    const token = `${header}.${invalidPayload}.${signature}`;

    assert.throws(
        () => formatter.decodeToken(token),
        /Unexpected token/,
        "Should throw an error for tokens with invalid base64 payloads"
    );
});

