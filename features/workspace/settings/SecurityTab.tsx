"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function SecurityTab() {
  return (
    <div className="space-y-6">
      {/* Account Security Status */}
      <div className="flex items-center gap-4 p-4 bg-accent rounded-lg border">
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10">
          <svg
            className="w-7 h-7 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M12 6v6l4 2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-medium">Your account security is 90%</div>
          <div className="text-sm text-muted-foreground">
            Please review your account security settings regularly and update
            your password.
          </div>
        </div>
        <Button variant="outline" size="sm">
          Dismiss
        </Button>
        <Button variant="default" size="sm">
          Review security
        </Button>
      </div>

      {/* Authentication Methods */}
      <div className="space-y-4">
        <div className="font-medium">Authentication Methods</div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">Magic Link Authentication</div>
              <div className="text-sm text-muted-foreground">
                Primary authentication method - sign in via email link
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">
                Active
              </Badge>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">Password Authentication</div>
              <div className="text-sm text-muted-foreground">
                Backup authentication method using username and password
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-muted/20 rounded-full relative">
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-muted rounded-full"></div>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium">Federated Identities</div>
              <div className="text-sm text-muted-foreground">
                Social login and enterprise identity providers
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Multi-Factor Authentication */}
      <div className="space-y-4">
        <div className="font-medium">Multi-Factor Authentication</div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">SMS Verification</div>
              <div className="text-sm text-muted-foreground">
                Receive verification codes via text message
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-primary/20 rounded-full relative">
                <div className="absolute left-5 top-0.5 w-5 h-5 bg-primary rounded-full"></div>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">Email Verification</div>
              <div className="text-sm text-muted-foreground">
                Receive verification codes via email
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-primary/20 rounded-full relative">
                <div className="absolute left-5 top-0.5 w-5 h-5 bg-primary rounded-full"></div>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">Authenticator Apps</div>
              <div className="text-sm text-muted-foreground">
                TOTP apps like Google Authenticator, Authy
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-muted/20 rounded-full relative">
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-muted rounded-full"></div>
              </div>
              <Button variant="outline" size="sm">
                Setup
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium">Hardware Security Keys</div>
              <div className="text-sm text-muted-foreground">
                FIDO2/WebAuthn security keys for maximum security
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-muted/20 rounded-full relative">
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-muted rounded-full"></div>
              </div>
              <Button variant="outline" size="sm">
                Setup
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Enterprise SSO */}
      <div className="space-y-4">
        <div className="font-medium">Enterprise Single Sign-On</div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">SAML Integration</div>
              <div className="text-sm text-muted-foreground">
                Enterprise identity providers (Okta, Azure AD, OneLogin)
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Not Configured
              </Badge>
              <Button variant="outline" size="sm">
                Setup
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">OIDC Providers</div>
              <div className="text-sm text-muted-foreground">
                OpenID Connect identity providers
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Not Configured
              </Badge>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium">Domain Verification</div>
              <div className="text-sm text-muted-foreground">
                Verify your organization&apos;s domain for SSO
              </div>
            </div>
            <Button variant="outline" size="sm">
              Verify Domain
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Security Events & Login History */}
      <div className="space-y-4">
        <div className="font-medium">Security Events & Login History</div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium text-sm">Successful login</div>
                <div className="text-xs text-muted-foreground">
                  Chrome on Mac OS X • San Francisco, CA • 2 hours ago
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Normal
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <div className="font-medium text-sm">
                  MFA verification required
                </div>
                <div className="text-xs text-muted-foreground">
                  Safari on iPhone • San Francisco, CA • 1 day ago
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              Verified
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <div className="font-medium text-sm">Failed login attempt</div>
                <div className="text-xs text-muted-foreground">
                  Unknown device • Tokyo, Japan • 3 days ago
                </div>
              </div>
            </div>
            <Badge variant="destructive" className="text-xs">
              Blocked
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <div className="font-medium text-sm">Password changed</div>
                <div className="text-xs text-muted-foreground">
                  Chrome on Mac OS X • San Francisco, CA • 1 week ago
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              Security
            </Badge>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          View All Security Events
        </Button>
      </div>

      <Separator />

      {/* Session Management */}
      <div className="space-y-4">
        <div className="font-medium">Session Management</div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">Session Duration</div>
              <div className="text-sm text-muted-foreground">
                How long users stay signed in (current: 24 hours)
              </div>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-border">
            <div>
              <div className="font-medium">Concurrent Sessions</div>
              <div className="text-sm text-muted-foreground">
                Allow multiple active sessions (current: 5 devices)
              </div>
            </div>
            <Button variant="outline" size="sm">
              Edit Limit
            </Button>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium">Force Logout All Devices</div>
              <div className="text-sm text-muted-foreground">
                Immediately sign out from all devices and sessions
              </div>
            </div>
            <Button variant="destructive" size="sm">
              Logout All
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Browsers and Devices */}
      <div className="space-y-4">
        <div className="font-medium">Browsers and devices</div>
        <div className="text-sm text-muted-foreground">
          These browsers and devices are currently signed in to your account.
          Remove any unauthorized devices.
        </div>

        <div className="border border-border rounded-lg divide-y">
          {/* Device Row 1 */}
          <div className="flex items-center p-4">
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/brave.svg"
              alt="Brave"
              className="w-6 h-6 mr-4"
            />
            <div className="flex-1">
              <div className="font-medium">Brave on Mac OS X</div>
              <div className="text-sm text-muted-foreground">
                Ninh Binh, Vietnam
              </div>
            </div>
            <Badge variant="destructive" className="mr-4">
              Current session
            </Badge>
            <Button variant="ghost" size="sm">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Device Row 2 */}
          <div className="flex items-center p-4">
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/apple.svg"
              alt="MacBook"
              className="w-6 h-6 mr-4"
            />
            <div className="flex-1">
              <div className="font-medium">Olive&apos;s MacBook Pro</div>
              <div className="text-sm text-muted-foreground">
                Ninh Binh, Vietnam
              </div>
            </div>
            <Badge variant="destructive" className="mr-4">
              Current session
            </Badge>
            <Button variant="ghost" size="sm">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Device Row 3 */}
          <div className="flex items-center p-4">
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/brave.svg"
              alt="Brave"
              className="w-6 h-6 mr-4"
            />
            <div className="flex-1">
              <div className="font-medium">Brave on Mac OS X</div>
              <div className="text-sm text-muted-foreground">
                Mexico City, Mexico
              </div>
            </div>
            <Badge variant="default" className="mr-4">
              1 month ago
            </Badge>
            <Button variant="ghost" size="sm">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Device Row 4 */}
          <div className="flex items-center p-4">
            <img
              src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/apple.svg"
              alt="MacBook"
              className="w-6 h-6 mr-4"
            />
            <div className="flex-1">
              <div className="font-medium">Olive&apos;s MacBook Pro</div>
              <div className="text-sm text-muted-foreground">
                Mexico City, Mexico
              </div>
            </div>
            <Badge variant="default" className="mr-4">
              1 month ago
            </Badge>
            <Button variant="ghost" size="sm">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecurityTab;
