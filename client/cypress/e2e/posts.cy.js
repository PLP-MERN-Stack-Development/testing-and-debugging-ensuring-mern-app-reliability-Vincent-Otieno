describe('Posts CRUD E2E Tests', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };

  const testPost = {
    title: 'Test Post Title',
    content: 'This is the test post content that should be long enough to pass validation.',
  };

  beforeEach(() => {
    // Clear any existing data
    cy.clearLocalStorage();
    cy.clearCookies();

    // Register and login user
    cy.register(testUser.username, testUser.email, testUser.password);
    cy.visit('/');
  });

  describe('View Posts', () => {
    it('should display list of posts', () => {
      cy.visit('/posts');

      // Should show posts list or empty state
      cy.get('[data-testid="posts-list"]').should('be.visible');
    });

    it('should display individual post', () => {
      // Create a post first
      cy.apiRequest('POST', '/api/posts', {
        title: testPost.title,
        content: testPost.content,
        category: '507f1f77bcf86cd799439011',
      }).then((response) => {
        const postId = response.body._id;

        // Visit post detail page
        cy.visit(`/posts/${postId}`);

        // Should display post content
        cy.contains(testPost.title).should('be.visible');
        cy.contains(testPost.content).should('be.visible');
      });
    });

    it('should show 404 for non-existent post', () => {
      cy.visit('/posts/507f1f77bcf86cd799439011');

      cy.contains(/not found|404/i).should('be.visible');
    });
  });

  describe('Create Post', () => {
    it('should display create post form', () => {
      cy.visit('/posts/new');

      cy.get('input[name="title"]').should('be.visible');
      cy.get('textarea[name="content"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should create a new post successfully', () => {
      cy.visit('/posts/new');

      // Fill out form
      cy.get('input[name="title"]').type(testPost.title);
      cy.get('textarea[name="content"]').type(testPost.content);

      // Submit form
      cy.get('button[type="submit"]').click();

      // Should redirect to post detail or posts list
      cy.url().should('not.include', '/new');

      // Should show success message
      cy.contains(/created|success/i).should('be.visible');
    });

    it('should show validation errors for empty form', () => {
      cy.visit('/posts/new');

      cy.get('button[type="submit"]').click();

      cy.contains(/required/i).should('be.visible');
    });

    it('should validate minimum content length', () => {
      cy.visit('/posts/new');

      cy.get('input[name="title"]').type('Title');
      cy.get('textarea[name="content"]').type('Short');
      cy.get('button[type="submit"]').click();

      cy.contains(/content/i).should('be.visible');
    });
  });

  describe('Edit Post', () => {
    let postId;

    beforeEach(() => {
      // Create a test post
      cy.apiRequest('POST', '/api/posts', {
        title: testPost.title,
        content: testPost.content,
        category: '507f1f77bcf86cd799439011',
      }).then((response) => {
        postId = response.body._id;
      });
    });

    it('should display edit form with existing data', () => {
      cy.visit(`/posts/${postId}/edit`);

      cy.get('input[name="title"]').should('have.value', testPost.title);
      cy.get('textarea[name="content"]').should('have.value', testPost.content);
    });

    it('should update post successfully', () => {
      cy.visit(`/posts/${postId}/edit`);

      const updatedTitle = 'Updated Post Title';
      const updatedContent = 'Updated post content that is long enough.';

      cy.get('input[name="title"]').clear().type(updatedTitle);
      cy.get('textarea[name="content"]').clear().type(updatedContent);
      cy.get('button[type="submit"]').click();

      // Should show updated content
      cy.contains(updatedTitle).should('be.visible');
      cy.contains(updatedContent).should('be.visible');
    });

    it('should not allow editing other users posts', () => {
      // Logout and login as different user
      cy.logout();
      cy.register('anotheruser', 'another@example.com', 'password123');

      cy.visit(`/posts/${postId}/edit`);

      // Should show error or redirect
      cy.contains(/permission|unauthorized/i).should('be.visible');
    });
  });

  describe('Delete Post', () => {
    let postId;

    beforeEach(() => {
      // Create a test post
      cy.apiRequest('POST', '/api/posts', {
        title: testPost.title,
        content: testPost.content,
        category: '507f1f77bcf86cd799439011',
      }).then((response) => {
        postId = response.body._id;
      });
    });

    it('should delete post successfully', () => {
      cy.visit(`/posts/${postId}`);

      // Click delete button
      cy.get('[data-testid="delete-button"]').click();

      // Confirm deletion
      cy.get('[data-testid="confirm-delete"]').click();

      // Should redirect to posts list
      cy.url().should('include', '/posts');
      cy.url().should('not.include', postId);

      // Should show success message
      cy.contains(/deleted/i).should('be.visible');
    });

    it('should show confirmation before deleting', () => {
      cy.visit(`/posts/${postId}`);

      cy.get('[data-testid="delete-button"]').click();

      // Should show confirmation dialog
      cy.contains(/confirm|sure/i).should('be.visible');
    });
  });

  describe('Post Interactions', () => {
    let postId;

    beforeEach(() => {
      cy.apiRequest('POST', '/api/posts', {
        title: testPost.title,
        content: testPost.content,
        category: '507f1f77bcf86cd799439011',
      }).then((response) => {
        postId = response.body._id;
      });
    });

    it('should like a post', () => {
      cy.visit(`/posts/${postId}`);

      cy.get('[data-testid="like-button"]').click();

      // Like count should increase
      cy.get('[data-testid="like-count"]').should('contain', '1');
    });

    it('should add a comment', () => {
      cy.visit(`/posts/${postId}`);

      const comment = 'This is a test comment';

      cy.get('textarea[name="comment"]').type(comment);
      cy.get('[data-testid="submit-comment"]').click();

      // Comment should appear
      cy.contains(comment).should('be.visible');
    });
  });

  describe('Navigation', () => {
    it('should navigate between posts', () => {
      cy.visit('/posts');

      // Click on a post
      cy.get('[data-testid="post-item"]').first().click();

      // Should navigate to post detail
      cy.url().should('include', '/posts/');
    });

    it('should navigate back to posts list', () => {
      cy.visit('/posts/507f1f77bcf86cd799439011');

      cy.get('[data-testid="back-button"]').click();

      cy.url().should('match', /\/posts\/?$/);
    });
  });
});
