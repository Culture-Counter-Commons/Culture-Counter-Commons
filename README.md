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

# Using Git

Create a branch

`$ git checkout -b feature-id master                 // creates a local branch for the new feature`

`$ git push origin feature-id                        // makes the new feature remotely available`

Periodically, changes made to master (if any) should be merged back into your feature branch.

`$ git merge master                                  // merges changes from master into feature branch`

When development on the feature is complete, the lead (or engineer in charge) should merge changes into master and then make sure the remote branch is deleted.

`$ git checkout master                               // change to the master branch` 

`$ git merge --no-ff feature-id                      // makes sure to create a commit object during merge`

`$ git push origin master                            // push merge changes`

`$ git push origin :feature-id                       // deletes the remote branch`