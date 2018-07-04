## git基础

### git 保证完整性
git中所有数据在存储前都计算校验和，然后以校验和来引用。这意味着不可能在git不知情时更改任何文件内容或目录内容。这个功能建构在git底层，是构成git哲学不可或缺的部分。若你在传送过程中丢失信息或损坏文件，git就能发现。

git数据库中保存的信息都是以文件内容的哈希值来索引，而不是文件名

### git一般只添加数据
你执行的git操作，几乎只往git数据库中增加数据。很难让git执行任何不可逆操作，或者让他以任何方式清除数据。同别的vcs一样，未提交更新时间有可能丢失或弄乱修改的内容；但是一旦你提交快照到git中，就难以在丢失数据，特别是如果你定期的推送数据库到其他仓库的话。

### 三种状态
已提交（committed）、已修改（modified）和已暂存（staged）。
已提交表示数据已经完全的保存在本地数据中
已修改表示修改了文件，但还没有保存到数据库中
已暂存表示对一个已修改文件的当前版本做了标记，使之包含在下次提交的快照中

git项目的三个工作区域的概念：git仓库、工作目录以及暂存区域。

git仓库目录是git用来保存项目的元数据和对象数据库的地方。这是git中最重要的部分，从其他计算机克隆仓库时，拷贝的就是这里的数据

工作目录是对项目的某个版本独立提取出来的内容。这些从git仓库的压缩数据库中提出来的文件，放在磁盘上供你使用或修改

暂存区域是一个文件，保存了下次将提交的文件列表信息，一般在git仓库目录中。有时候也被称作“索引”，不过一般说法还是叫暂存区域

基本的git工作流程如下：
* 在工作目录中修改文件
* 暂存文件，将文件的快照存入暂存区域
* 提交更新，找到暂存区域的文件，将快照永久性存储到git仓库目录

```git
$ git clone [url] [name]
```

#### 记录每次更新到仓库
工作目录下的每一个文件都不外乎两种状态：已跟踪或未跟踪。已跟踪的文件是指那些被纳入了版本控制的文件，在上一次快照中有他们的记录，在工作一段时间后，他们的状态可能处于未修改，已修改或已存放入暂存区。工作目录中除已跟踪文件以外的所有其他文件都属于未跟踪文件，他们既不存在于上次快照的记录中，也没有放入暂存区。初次克隆某个仓库的时候哦，工作目录中的所有文件都属于已跟踪文件，并处于未修改状态

untracked  unmodified  modified  staged

#### 检查当前文件状态
```git
$ git  status
On branch master
nothing to commit,working directory clean
```
这说明你现在的工作目录相当干净。话句话说，所有已跟踪文件在上次提交后都未被更改过。
#### 跟踪新文件
```git
$ git add *
```
#### 暂存已修改文件
```git 
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md
````
`git add`是个多功能命令：可以用它开始跟踪新文件，或者把已跟踪的文件放到暂存区，还能用于合并时把有冲突的文件标记为已解决状态等。 
```git 
$ git add CONTRIBUTING.md
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    new file:   README
    modified:   CONTRIBUTING.md
```
#### 状态简览
```git
$ git status -s
 M README              
MM Rakefile            //出现在右边的 M 表示该文件被修改了但是还没放入暂存区，出现在靠左边的 M 表示该文件被修改了并放入了暂存区
A  lib/git.rb          //新添加到暂存区中的文件前面有 A 标记
M  lib/simplegit.rb
?? LICENSE.txt         //新添加的未跟踪文件前面有 ?? 标记
```
#### 忽略文件
`.gitignore`文件
```git
$ cat .gitignore
*.[oa]    //忽略所有以.o或.a结尾的文件
*~        //忽略所有以波浪符（~）结尾的文件
```
`.gitignore`的格式规范如下：
* 所有空行后者以#开头的行都会被git忽略
* 可以使用标准的glob模式匹配
* 匹配模式可以以（/）开头防止递归
* 匹配模式可以以（/）结尾指定目录
* 要忽略指定模式以外的文件或目录，可以在模式前加上惊叹号（！）取反

#### 跳过使用暂存区域
git提供了一个跳过使用暂存区域的方式，只要在提交的时候，给git commit加上-a选项，git就会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过git add步骤
```git
$ git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

    modified:   CONTRIBUTING.md

no changes added to commit (use "git add" and/or "git commit -a")
$ git commit -a -m 'added new benchmarks'
[master 83e38c7] added new benchmarks
 1 file changed, 5 insertions(+), 0 deletions(-)
 ```
 #### 移除文件
 要从git中移除某个文件，就必须要从已跟踪文件清单中移除（确切地说，是从暂存区域移除），然后提价。可以用git rm命令完成此项工作，并连带从工作目录中删除指定的文件，这样以后就不会出现未跟踪文件清单中了。
 如果只是简单地从工作目录中手工删除文件，运行`git status`时就会在"Change not staged for commit"部分中看到：
 ```git
 $ rm PROJECTS.md
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        deleted:    PROJECTS.md

no changes added to commit (use "git add" and/or "git commit -a")
````
然后再运行 git rm 记录此次移除文件的操作：
```git
$ git rm PROJECTS.md
rm 'PROJECTS.md'
$ git status
On branch master
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

    deleted:    PROJECTS.md
```
下一次提交时，该文件就不再纳入版本管理了。 如果删除之前修改过并且已经放到暂存区域的话，则必须要用强制删除选项 -f（译注：即 force 的首字母）。 这是一种安全特性，用于防止误删还没有添加到快照的数据，这样的数据不能被 Git 恢复。

另外一种情况是，我们想把文件从 Git 仓库中删除（亦即从暂存区域移除），但仍然希望保留在当前工作目录中。 换句话说，你想让文件保留在磁盘，但是并不想让 Git 继续跟踪。 当你忘记添加 .gitignore 文件，不小心把一个很大的日志文件或一堆 .a 这样的编译生成文件添加到暂存区时，这一做法尤其有用。 为达到这一目的，使用 --cached 选项：
```git
$ git rm --cached README
```
#### 移动文件
对git中文件改名，可以这么做：
```git
$ git mv file_from file_to
```
### 查看提交历史
```git
$ git log
$ git log -p -2    //-p用来显示每次提交的内容差异，-2仅显示最近两次提交
$ git log --stat   //显示每次提交的简略的统计信息
$ git log --pretty //指定使用不同于默认格式的方式展示提交历史
```
### 撤销操作





