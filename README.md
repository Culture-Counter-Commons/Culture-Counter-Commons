# Culture-Counter-Commons

## Get it running on [ThemeKit](https://www.shopify.com/partners/blog/git-guide#workflow)

1. On Terminal in theme folder:
    - `$ brew tap shopify/shopify`
    
2. In Shopify navigate to `apps/privateApp/` create & copy the: `the-private-app-admin-api-password`
    - Fill out the information at the top and set the permissions of "Theme templates and theme assets" to have Read and write access.
    
3. Get the theme ID#:
    - `$ theme get --list -p=[the-private-app-admin-api-password] -s=[you-store.myshopify.com]`
    
4. Create the `config` file and download the theme files:
    - `$ theme get -p=[your-password] -s=[you-store.myshopify.com] -t=[your-theme-id]`
    
5. *if you are not using CodeKit run browsersync:*
    - `$ browser-sync start --proxy "https://<mystore>.myshopify.com/" --files "*/*.*" --reload-delay 1000`
        
6. If using CodeKit, in CodeKit navigate to: `Settings/Browser-Refreshing`
    1. turn on "Use An External Server"
    2. External Server Address:
        - add https://store-name.myshopify.com

5. To start ThemeKit and upload theme files on save:
    - `$ theme watch`
