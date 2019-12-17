# Contributing to Mi horario UN
- [Code of Conduct](#coc)
- [Issues and Bugs](#issue)
- [Submitting a Pull Request](#submit-pr)

## <a name="coc"></a> Code of Conduct
Help us keep Angular open and inclusive. Please read and follow our [Code of Conduct][coc].

## <a name="issue"></a> Found a Bug?
If you find a bug in the source code, you can help us by
submitting an issue to our [GitHub Repository][github]. Even better, you can
[submit a Pull Request](#submit-pr) with a fix.

## <a name="submit-pr"></a> Submitting a Pull Request (PR)
1. Select or create an issue

2. Fork the repo

3. Create a new branch using the following format `git checkout -b feature/#${ISSUE_NUMBER}-${ISSUE_TITLE}`

    ```shell
    # Example
    git checkout -b feature/#55-new-issue
    ```
    
4. Use the issue references keywords [More information](https://help.github.com/en/github/managing-your-work-on-github/closing-issues-using-keywords#about-issue-references)

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

[coc]: https://github.com/sjdonado/mihorario/blob/master/CODE_OF_CONDUCT.md
[github]: https://github.com/sjdonado/mihorario