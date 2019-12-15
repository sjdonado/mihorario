# 📆 Mi horario UN
> Import your Uninorte schedule to Google Calendar.
<div align="center">
    <a href="https://mihorarioun.web.app">
        <img src="/client/src/assets/screens.svg" alt="Mi horario UN" width="800px" />
    </a>
</div>

## How to run?
### Server

```shell
  cd server && docker-compose up
```
### Client

```shell
  cd client && npm start
```

## Contributing
1. Select or create an issue

2. Fork the repo

3. Create a new branch using the following format `git checkout -b feature/#${ISSUE_NUMBER}-${ISSUE_TITLE}`

    ```shell
    # Example
    git checkout -b feature/#55-new-issue
    ```
    
4. Use the close issues keywords [More information](https://help.github.com/en/github/managing-your-work-on-github/closing-issues-using-keywords#about-issue-references)

    ```shell
    # Example
    feat: New issue finished
      - Testing
      - Testing
    Resolve: #55
    ```
 5. In GitHub, send a pull request to `sjdonado/mihorario:master`.
  * If we suggest changes then:
    * Make the required updates.
    * Re-run the Angular test suites to ensure tests are still passing.
    * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):
    
      ```shell
      git rebase master -i
      git push -f
      ```
      
 6. Rebase your branch and force push to your GitHub repository (this will update your Pull Request):
 
     ```shell
    git rebase master -i
    git push -f
    ```

### That's it! Thank you for your contribution!

#### After your pull request is merged
After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

7. Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ```shell
    git push origin --delete my-fix-branch
    ```

8. Check out the master branch:

    ```shell
    git checkout master -f
    ```

9. Delete the local branch:

    ```shell
    git branch -D my-fix-branch
    ```

10. Update your master with the latest upstream version:

    ```shell
    git pull --ff upstream master

## External dependencies
* **Uninorte API connection:** Unofficial GraphQL wrapper for Uninorte API: [uninorte-graphql](https://github.com/krthr/uninorte-graphql)

## Contributors
<table>
  <tr>
    <td align="center"><a href="https://github.com/sjdonado"><img src="https://avatars.githubusercontent.com/u/27580836?s=96&v=4" width="100px;" alt="Juan Rodriguez"/><br /><sub><b>Juan Rodriguez</b></sub></a></td>
  </tr>
<table>

## Credits
Original idea: [mihorario](https://uncal.herokuapp.com) made by [krthr](https://github.com/krthr)

#### mihorarioUN is an open source project that is not associated directly with Universidad del Norte.
