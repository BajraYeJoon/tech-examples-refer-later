import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Reusable base schemas
const nameSchema = z.string()
  .min(2, 'Must be at least 2 characters')
  .max(50, 'Must be less than 50 characters')
  .transform(val => val.trim())
  .refine(val => /^[a-zA-Z\s-']+$/.test(val), {
    message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
  })

const phoneSchema = z.string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
  .transform(val => val.replace(/\s+/g, ''))

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character')

// Enums and constants
const THEMES = ['light', 'dark', 'system'] as const
const LANGUAGES = ['en', 'es', 'fr', 'de'] as const
const ROLES = ['user', 'admin', 'moderator'] as const

// Advanced schema with all features
const formSchema = z.object({
  profile: z.object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: z.string()
      .email('Invalid email address')
      .transform(val => val.toLowerCase()),
    age: z.number()
      .int('Age must be a whole number')
      .min(18, 'Must be at least 18 years old')
      .max(120, 'Invalid age'),
    phone: phoneSchema.optional(),
    bio: z.string()
      .max(500, 'Bio must be less than 500 characters')
      .optional()
      .nullable(),
    avatar: z.string()
      .url('Invalid URL')
      .startsWith('https://', 'URL must use HTTPS')
      .optional(),
    socialLinks: z.array(
      z.object({
        platform: z.enum(['twitter', 'linkedin', 'github']),
      
        url: z.string().url().startsWith('https://', 'URL must use HTTPS')
      })
    ).default([])
  }),

  preferences: z.object({
    theme: z.enum(THEMES).default('system'),
    language: z.enum(LANGUAGES).default('en'),
    notifications: z.object({
      email: z.boolean().default(true),
      push: z.boolean().default(true),
      frequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly')
    }).default({}),
    newsletter: z.boolean().default(false),
    timezone: z.string().regex(/^UTC[+-][0-9]{1,2}$/, 'Invalid timezone format').default('UTC+0'),
    currency: z.string().length(3, 'Currency must be a 3-letter code').toUpperCase().default('USD')
  }).default({}),

  security: z.object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
    twoFactorEnabled: z.boolean().default(false),
    recoveryEmail: z.string().email('Invalid recovery email').optional(),
    lastPasswordChange: z.date().default(() => new Date())
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),

  address: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('residential'),
      street: z.string().min(1),
      city: z.string().min(1),
      country: z.string().min(1),
      postalCode: z.string().min(1),
      isDefault: z.boolean()
    }),
    z.object({
      type: z.literal('business'),
      companyName: z.string().min(1),
      street: z.string().min(1),
      city: z.string().min(1),
      country: z.string().min(1),
      postalCode: z.string().min(1),
      vatNumber: z.string().optional()
    })
  ]),

  roles: z.array(z.enum(ROLES)).min(1, 'At least one role must be selected').default(['user']),

  metadata: z.map(
    z.string(),
    z.string()
  ).default(new Map()),

  timestamps: z.object({
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date())
  }).default({})
})

type FormData = z.infer<typeof formSchema>

const HookFormTutorial = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      profile: {
        firstName: '',
        lastName: '',
        email: '',
        age: 18,
        phone: undefined,
        bio: null,
        avatar: undefined,
        socialLinks: []
      },
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          frequency: 'weekly'
        },
        newsletter: false,
        timezone: 'UTC+0',
        currency: 'USD'
      },
      security: {
        password: '',
        confirmPassword: '',
        twoFactorEnabled: false,
        recoveryEmail: undefined,
        lastPasswordChange: new Date()
      },
      address: {
        type: 'residential',
        street: '',
        city: '',
        country: '',
        postalCode: '',
        isDefault: true
      },
      roles: ['user'],
      metadata: new Map(),
      timestamps: {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  })

  // Example 1: Set a single nested field
  const updateFirstName = () => {
    setValue('profile.firstName', 'John', {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
  }

  // Example 2: Set multiple fields at once
  const fillProfileData = () => {
    setValue('profile', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      age: 25,
      phone: '+1234567890',
      bio: 'Software Developer',
      avatar: 'https://example.com/avatar.jpg',
      socialLinks: [
        {
          platform: 'github',
          url: 'https://github.com/johndoe'
        }
      ]
    }, { shouldValidate: true })
  }

  // Example 3: Set entire form data
  const loadSampleData = () => {
    setValue('profile', {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      age: 30,
      phone: '+1987654321',
      bio: 'Senior Developer',
      avatar: 'https://example.com/jane.jpg',
      socialLinks: [
        {
          platform: 'linkedin',
          url: 'https://linkedin.com/in/janesmith'
        }
      ]
    })

    setValue('preferences', {
      theme: 'dark',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        frequency: 'daily'
      },
      newsletter: true,
      timezone: 'UTC+1',
      currency: 'EUR'
    })

    setValue('address', {
      type: 'residential',
      street: '123 Main St',
      city: 'New York',
      country: 'USA',
      postalCode: '10001',
      isDefault: true
    }, { shouldValidate: true })
  }

  // Example 4: Conditional setValue with complex object
  const updateNotifications = (enabled: boolean) => {
    setValue('preferences.notifications', {
      email: enabled,
      push: enabled,
      frequency: enabled ? 'weekly' : 'monthly'
    })
    if (!enabled) {
      setValue('preferences.newsletter', false, { shouldValidate: true })
    }
  }

  // Example 5: setValue with calculations
  const incrementAge = () => {
    const currentAge = watch('profile.age')
    const newAge = currentAge + 1
    setValue('profile.age', newAge, { shouldValidate: true })
  }

  const onSubmit = async (data: FormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', data)
      reset()
    } catch (error) {
      console.error('Submission error:', error)
    }
  }

  return (
    <div className=" mx-auto p-6 *:text-black bg-white w-full  rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Advanced Form with setValue Examples</h1>
      <div className="mb-8 space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={updateFirstName}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Set First Name
          </button>
          <button
            type="button"
            onClick={fillProfileData}
            className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
          >
            Fill Profile
          </button>
          <button
            type="button"
            onClick={loadSampleData}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
          >
            Load All Data
          </button>
          <button
            type="button"
            onClick={incrementAge}
            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
          >
            Increment Age
          </button>
        </div>
      </div>

       <div className='flex flex-row gap-2 mx-auto'>
      

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                {...register('profile.firstName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.profile?.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.profile.firstName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                {...register('profile.lastName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.profile?.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.profile.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('profile.email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.profile?.email && (
              <p className="mt-1 text-sm text-red-600">{errors.profile.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              id="age"
              type="number"
              {...register('profile.age', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.profile?.age && (
              <p className="mt-1 text-sm text-red-600">{errors.profile.age.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone (Optional)
            </label>
            <input
              id="phone"
              type="tel"
              {...register('profile.phone')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="+1234567890"
            />
            {errors.profile?.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.profile.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio (Optional)
            </label>
            <textarea
              id="bio"
              {...register('profile.bio')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              rows={3}
            />
            {errors.profile?.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.profile.bio.message}</p>
            )}
          </div>

          {/* Add Social Links */}
          <div>
            <label htmlFor="socialLinks" className="block text-sm font-medium text-gray-700">
              Social Links
            </label>
            <div id="socialLinks" className="space-y-2">
              {watch('profile.socialLinks')?.map((link, index) => (
                <div key={`${link.platform}-${link.url}-${index}`} className="grid grid-cols-2 gap-2">
                  <select
                    id={`socialLink-platform-${index}`}
                    {...register(`profile.socialLinks.${index}.platform`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                  </select>
                  <input
                    id={`socialLink-url-${index}`}
                    type="url"
                    {...register(`profile.socialLinks.${index}.url`)}
                    placeholder="https://"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const currentLinks = watch('profile.socialLinks') || []
                  setValue('profile.socialLinks', [
                    ...currentLinks,
                    { platform: 'twitter', url: '' }
                    
                  ])
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Social Link
              </button>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preferences</h3>
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <select
              id="theme"
              {...register('preferences.theme')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              {THEMES.map(theme => (
                <option key={theme} value={theme}>
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              id="language"
              {...register('preferences.language')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Notification Preferences</h4>
            <div className="flex items-center">
              <input
                id="emailNotif"
                type="checkbox"
                {...register('preferences.notifications.email')}
                className="h-4 w-4 rounded border-gray-300"
                onChange={(e) => updateNotifications(e.target.checked)}
              />
              <label htmlFor="emailNotif" className="ml-2 block text-sm text-gray-700">
                Email Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="pushNotif"
                type="checkbox"
                {...register('preferences.notifications.push')}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="pushNotif" className="ml-2 block text-sm text-gray-700">
                Push Notifications
              </label>
            </div>
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                Notification Frequency
              </label>
              <select
                id="frequency"
                {...register('preferences.notifications.frequency')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <input
              id="timezone"
              {...register('preferences.timezone')}
              placeholder="UTC+0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.preferences?.timezone && (
              <p className="mt-1 text-sm text-red-600">{errors.preferences.timezone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
              Currency
            </label>
            <input
              id="currency"
              {...register('preferences.currency')}
              placeholder="USD"
              maxLength={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm uppercase"
            />
            {errors.preferences?.currency && (
              <p className="mt-1 text-sm text-red-600">{errors.preferences.currency.message}</p>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Security</h3>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('security.password')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.security?.password && (
              <p className="mt-1 text-sm text-red-600">{errors.security.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('security.confirmPassword')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.security?.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.security.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="twoFactor"
              type="checkbox"
              {...register('security.twoFactorEnabled')}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="twoFactor" className="text-sm text-gray-700">
              Enable Two-Factor Authentication
            </label>
          </div>

          <div>
            <label htmlFor="recoveryEmail" className="block text-sm font-medium text-gray-700">
              Recovery Email
            </label>
            <input
              id="recoveryEmail"
              type="email"
              {...register('security.recoveryEmail')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.security?.recoveryEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.security.recoveryEmail.message}</p>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Address</h3>

          <div>
            <label htmlFor="addressType" className="block text-sm font-medium text-gray-700">
              Address Type
            </label>
            <select
              id="addressType"
              {...register('address.type')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="residential">Residential</option>
              <option value="business">Business</option>
            </select>
          </div>

          {watch('address.type') === 'business' && (
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                id="companyName"
                {...register('address.companyName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">Please enter a valid company name</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              id="street"
              {...register('address.street')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.address?.street && (
              <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                id="city"
                {...register('address.city')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.address?.city && (
                <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                id="postalCode"
                {...register('address.postalCode')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.address?.postalCode && (
                <p className="mt-1 text-sm text-red-600">{errors.address.postalCode.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              id="country"
              {...register('address.country')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
            {errors.address?.country && (
              <p className="mt-1 text-sm text-red-600">{errors.address.country.message}</p>
            )}
          </div>

          {watch('address.type') === 'residential' && (
            <div className="flex items-center space-x-2">
              <input
                id="isDefault"
                type="checkbox"
                {...register('address.isDefault')}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Set as Default Address
              </label>
            </div>
          )}

          {watch('address.type') === 'business' && (
            <div>
              <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700">
                VAT Number (Optional)
              </label>
              <input
                id="vatNumber"
                {...register('address.vatNumber')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">Please enter a valid VAT number</p>
              )}
            </div>
          )}
        </div>

        {/* Roles Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Roles</h3>
          <div className="space-y-2">
            {ROLES.map(role => (
              <div key={role} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`role-${role}`}
                  value={role}
                  checked={watch('roles')?.includes(role)}
                  onChange={(e) => {
                    const currentRoles = watch('roles') || []
                    if (e.target.checked) {
                      setValue('roles', [...currentRoles, role])
                    } else {
                      setValue('roles', currentRoles.filter(r => r !== role))
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor={`role-${role}`} className="text-sm text-gray-700 capitalize">
                  {role}
                </label>
              </div>
            ))}
          </div>
          {errors.roles && (
            <p className="mt-1 text-sm text-red-600">{errors.roles.message}</p>
          )}
        </div>

        {/* Metadata Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Metadata</h3>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                const key = prompt('Enter metadata key:')
                const value = prompt('Enter metadata value:')
                if (key && value) {
                  const currentMetadata = watch('metadata')
                  currentMetadata.set(key, value)
                  setValue('metadata', new Map(currentMetadata))
                }
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Metadata
            </button>
            <div className="space-y-2">
              {Array.from(watch('metadata')?.entries() || []).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{key}: {value}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const currentMetadata = watch('metadata')
                      currentMetadata.delete(key)
                      setValue('metadata', new Map(currentMetadata))
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Data Preview */}
       

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

       <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Current Form Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({
              ...watch(),
              metadata: Object.fromEntries(watch('metadata') || new Map())
            }, null, 2)}
          </pre>
        </div>
       </div>
  
    </div>
  )
}

export default HookFormTutorial 
